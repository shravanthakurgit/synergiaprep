"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExamDetailsForm } from "./ExamDetailsForms";
import { SectionDetailsForm } from "./SectionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { uploadFileToS3 } from "./action";
import { set } from "date-fns";

const LOCAL_STORAGE_KEY = "examDetails";

const ExamCreator = ({
  draft,
  onFinish,
}: {
  draft: DraftExam | null;
  onFinish?: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState<string>("exam");
  const [ExamDetails, setExamDetails] = useState<ExamDetails>(
    draft?.examDetails || {
      title: "",
      instruction: "",
      description: "",
      examTypeId: "",
      examType: "",
      accessType:"FREE",
      examCategoryId: "",
      examCategory: "",
      topicId: "",
      topic: "",
      courseId: "",
    }
  );
  const [examSections, setExamSections] = useState<SectionFormState[]>(
    draft?.examSections || []
  );

  const [isSubmitExam, setSubmitExam] = useState(false)

  // In ExamForm.tsx
  const uploadAllImages = async (sections: SectionFormState[]) => {
    const uploadPromises = sections.flatMap((section) =>
      section.questions.flatMap(async (question) => {
        // Upload question image
        const questionImageUrl = question.imageFile
          ? await uploadFileToS3(question.imageFile.file)
          : undefined;

        // Upload option images
        const optionImageUrls = await Promise.all(
          question.options?.map(async (option) =>
            option.imageFile
              ? await uploadFileToS3(option.imageFile.file)
              : undefined
          ) || []
        );

        // Upload answer explanation image
        const answerImageUrl = question.answerExplanationField.imageFile
          ? await uploadFileToS3(question.answerExplanationField.imageFile.file)
          : undefined;

        return {
          question,
          questionImageUrl,
          optionImageUrls,
          answerImageUrl,
        };
      })
    );

    return Promise.all(uploadPromises);
  };

  const handleExamSubmit = async () => {
    try {
      //console.log('examSections :',examSections);
      setSubmitExam(true);

      const uploadResults = await uploadAllImages(examSections);

      //console.log('uploaded res: ',uploadResults);

      // 2. Transform data with uploaded URLs
      const sectionsWithUrls = examSections.map((section, sectionIndex) => ({
        ...section,
        questions: section.questions.map(
          ({ imageFile, ...question }, questionIndex) => {
            const result = uploadResults.find(
              (res) => res.question.text === question.text
            );

            return {
              ...question,
              imageUrl: result?.questionImageUrl,
              options: question.options?.map(
                ({ imageFile, ...option }, optionIndex) => ({
                  ...option,
                  imageUrl: result?.optionImageUrls[optionIndex],
                })
              ),
              answerExplanationField: {
                ...Object.fromEntries(
                  Object.entries(question.answerExplanationField).filter(
                    ([key]) => key !== "imageFile"
                  )
                ),
                imageUrl: result?.answerImageUrl,
              },
            };
          }
        ),
      }));

      //console.log('section with urls : ',sectionsWithUrls);

      // 3. Now submit the complete data
      await submitExamData(sectionsWithUrls);

      // 4. Clean up object URLs
      examSections.forEach((section) => {
        section.questions.forEach((question) => {
          if (question.imageFile?.previewUrl)
            URL.revokeObjectURL(question.imageFile.previewUrl);
          question.options?.forEach((option) => {
            if (option.imageFile?.previewUrl)
              URL.revokeObjectURL(option.imageFile.previewUrl);
          });
          if (question.answerExplanationField.imageFile?.previewUrl) {
            URL.revokeObjectURL(
              question.answerExplanationField.imageFile.previewUrl
            );
          }
        });
      });
      setSubmitExam(false);
    } catch (error) {
      console.error("Error submitting exam:", error);
      // Handle error
      setSubmitExam(false);
    }
  };

  async function submitExamData(sectionsWithUrls: ExamSection[]) {
    {
      // get data in terms of QuestionFormState
      // upload in aws
      // convert the data in Question
      // then rest ...

      const data = {
        title: ExamDetails.title,
        instructions: ExamDetails.instruction,
        description: ExamDetails.description,
        isDraft: false,
        examType: ExamDetails.examType,
        accessType: ExamDetails.accessType,
        examCategoryId: ExamDetails.examCategoryId,
        courseId: ExamDetails.courseId, 
        totalDurationInSeconds: ExamDetails.totalDurationInSeconds,
        examSections: sectionsWithUrls.map((section) => ({
          name: section.name,
          description: section.description,
          isAllQuestionsMandatory: section.isAllQuestionsMandatory,
          numberOfQuestionsToAttempt: section.questions.length,
          sectionConfigId: section.sectionConfigId,
          subjectId: section.subjectId,
          questions: section.questions,
        })),
      };

      console.log("post data : ", data);

      try {
        const response = await fetch("/api/v1/exams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Exam created successfully!");
          if (onFinish) {
            onFinish();
            removeDraft(draft!.id);
          }
          setCurrentStep("exam");
        }
        // throw new Error(response.statusText);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }
  function removeDraft(draftId: number) {
    try {
      const existingDrafts: DraftExam[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );

      const updatedDrafts = existingDrafts.filter(
        (draft) => draft.id !== draftId
      );

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDrafts));

      console.log(`Draft with id ${draftId} removed successfully.`);
    } catch (error) {
      console.error("Error removing draft:", error);
    }
  }
  function handleExamDraftSubmit() {
    try {
      let draftId = draft?.id;

      const existingDrafts = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );

      const newDraft = {
        id: draftId ?? Date.now(),
        examDetails: ExamDetails,
        examSections: examSections,
        savedAt: new Date().toISOString(),
      };

      const updatedDrafts = draftId
        ? existingDrafts.map((draft: DraftExam) =>
            draft.id === draftId ? newDraft : draft
          )
        : [...existingDrafts, newDraft];

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDrafts));

      //console.log(`Draft saved for user ${userId}:`, newDraft);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }

  return (
    <>
      <ExamDetailsHeader ExamDetails={ExamDetails} />
      <div className="p-6 mx-auto w-full">
        {currentStep === "exam" && (
          <ExamDetailsForm
            setCurrentStep={setCurrentStep}
            ExamDetails={ExamDetails}
            setExamDetails={setExamDetails}
          />
        )}

        {currentStep === "section" && (
          <div className="space-y-4">
            <div className="space-x-4">
              <Button
                onClick={() => setCurrentStep("exam")}
                className="mt-4"
                variant={"outline"}
              >
                Edit Exam Details
              </Button>
              <Button onClick={async () => setCurrentStep("preview")}>
                Preview Exam
              </Button>
            </div>

            <SectionDetailsForm
              examSections={examSections}
              setCurrentStep={setCurrentStep}
              setExamSections={setExamSections}
              examConfigId={ExamDetails.examCategoryId}
            />
          </div>
        )}

        {currentStep === "preview" && (
          <div className="space-y-4">
            <div className="space-x-4">
              <Button
                onClick={() => setCurrentStep("exam")}
                className="mt-4"
                variant={"outline"}
              >
                Edit Exam Details
              </Button>
              <Button
                onClick={() => setCurrentStep("section")}
                className="mt-4"
                variant={"outline"}
              >
                Edit Questions
              </Button>
              <Button onClick={() => handleExamDraftSubmit()}>
                Submit Draft
              </Button>
              <Button disabled={isSubmitExam} onClick={() => handleExamSubmit()}>{isSubmitExam ? "Submitting..." : "Submit Exam"}</Button>
            </div>
            <ExamPreview
              examDetails={ExamDetails}
              examSections={examSections}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ExamCreator;

const ExamDetailsHeader = ({ ExamDetails }: { ExamDetails: ExamDetails }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
    <div className="border p-4 rounded-md bg-muted">
      <p>
        <strong>Title:</strong> {ExamDetails.title}
      </p>
      <p>
        <strong>Instruction:</strong> {ExamDetails.instruction}
      </p>
      <p>
        <strong>Description:</strong> {ExamDetails.description}
      </p>
      <p>
        <strong>Exam Type:</strong> {ExamDetails.examType}
      </p>
      <p>
        <strong>Exam Category:</strong> {ExamDetails.examCategory}
      </p>
      {/* <p>
        <strong>Subject:</strong> {ExamDetails.subject}
      </p>
      {ExamDetails.topic!=="" && <p>
        <strong>Topic:</strong> {ExamDetails.topic}
      </p>} */}
      <p>
        <strong>Total Duration:</strong>{" "}
        {(ExamDetails.totalDurationInSeconds ?? 0) / 60} minutes
      </p>
    </div>
  </div>
);

const ExamPreview = ({
  examDetails,
  examSections,
}: {
  examDetails: ExamDetails;
  examSections: SectionFormState[];
}) => {
  return (
    <div className="space-y-8">
      {/* Exam Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Title</h3>
                <p>{examDetails.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>{examDetails.totalDurationInSeconds} seconds</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Instructions</h3>
              <p className="whitespace-pre-wrap">{examDetails.instruction}</p>
            </div>

            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="whitespace-pre-wrap">{examDetails.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Exam Type</h3>
                <p>{examDetails.examType}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{examDetails.examCategory}</p>
              </div>
            </div>

            {examDetails.subject && (
              <div>
                <h3 className="font-semibold">Subject</h3>
                <p>{examDetails.subject}</p>
              </div>
            )}

            {examDetails.topic && (
              <div>
                <h3 className="font-semibold">Topic</h3>
                <p>{examDetails.topic}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sections Preview */}
      {examSections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
            <CardTitle>
              Section {sectionIndex + 1}: {section.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{section.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Configuration</h3>
                  <p>
                    Questions to attempt: {section.numberOfQuestionsToAttempt}
                  </p>
                  <p>
                    All questions mandatory:{" "}
                    {section.isAllQuestionsMandatory ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Questions */}
              <MathJaxContext>
                <div className="space-y-6">
                  <h3 className="font-semibold">Questions</h3>
                  {section.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">
                          Question {questionIndex + 1}
                        </h4>
                        <span
                          className={cn("px-2 py-1 rounded text-sm", {
                            "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200":
                              question.difficultyLevel === "EASY",
                            "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200":
                              question.difficultyLevel === "MEDIUM",
                            "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200":
                              question.difficultyLevel === "HARD",
                          })}
                        >
                          {question.difficultyLevel}
                        </span>
                      </div>

                      <div>
                        <p className="whitespace-pre-wrap">
                          <MathJax inline>{question.text}</MathJax>
                        </p>
                        {question.imageFile?.previewUrl && (
                          <Image
                            src={question.imageFile?.previewUrl}
                            alt="Question image"
                            className="mt-2 max-w-md rounded"
                            width={500}
                            height={500}
                          />
                        )}
                      </div>

                      {question.options && (
                        <div className="space-y-2">
                          <h5 className="font-medium">Options:</h5>
                          <div className="grid gap-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={cn(
                                  "p-2 rounded-md",
                                  option.isCorrect
                                    ? "bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-300"
                                    : "bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-300"
                                )}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <div className="flex-1">
                                    <p>
                                      <MathJax inline>{option.text}</MathJax>
                                    </p>
                                    {option.imageFile?.previewUrl && (
                                      <Image
                                        src={option.imageFile.previewUrl}
                                        alt="Option image"
                                        className="mt-2 max-w-md rounded"
                                        width={500}
                                        height={500}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.answerExplanationField && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          {question.answerExplanationField.text && (
                            <>
                              <h5 className="font-medium text-blue-800">
                                Text:
                              </h5>
                              <p className="text-blue-700">
                                <MathJax inline>
                                  {question.answerExplanationField.text}
                                </MathJax>
                              </p>
                            </>
                          )}
                          {question.answerExplanationField.value && (
                            <>
                              <h5 className="font-medium text-blue-800">
                                Value:
                              </h5>
                              <p className="text-blue-700">
                                <MathJax inline>
                                  {question.answerExplanationField.value}
                                </MathJax>
                              </p>
                            </>
                          )}
                          {question.answerExplanationField.explanation && (
                            <>
                              <h5 className="font-medium text-blue-800">
                                Explanation:
                              </h5>
                              <p className="text-blue-700">
                                <MathJax inline>
                                  {question.answerExplanationField.explanation}
                                </MathJax>
                              </p>
                            </>
                          )}
                          {question.answerExplanationField.imageFile
                            ?.previewUrl && (
                            <Image
                              src={
                                question.answerExplanationField.imageFile
                                  ?.previewUrl
                              }
                              alt="Answer image"
                              className="mt-2 max-w-md rounded"
                              width={500}
                              height={500}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </MathJaxContext>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
