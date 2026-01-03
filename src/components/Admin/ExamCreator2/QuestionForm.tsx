// Question Form

import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { ChangeEvent } from "react";
import Image from "next/image";
import { uploadImgDB } from "@/app/actions/img";
import { LatexEditor } from "./PopupLatexInput";
import { set } from "date-fns";

const getQuestionType = (sectionName: string): QuestionType => {
  const name = sectionName.toUpperCase();
  if (name.includes("INTEGER") || name.includes("NUMERICAL")) return "INTEGER";
  if (name.includes("MULTI")) return "MULTI";
  return "SINGLE";
};

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\(", "\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\[", "\]"],
    ],
    processEscapes: true,
  },
  options: {
    enableMenu: false,
  },
  startup: {
    typeset: true,
  },
};

const createQuestionSchema = (questionType: QuestionType) => {
  const baseSchema = {
    text: z.string().min(1, "Question text is required"),
    imageFile: z.any().optional(),
    chapterId: z.string().min(1, "Chapter ID is required"),
    difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  };

  const answerExplanationSchema = {
    text: z.string().optional(),
    explanation: z.string().optional(),
    imageFile: z.any().optional(),
  };

  switch (questionType) {
    case "INTEGER":
      return z.object({
        ...baseSchema,
        answerExplanationField: z.object({
          ...answerExplanationSchema,
          value: z.string().min(1, "Numerical answer is required"),
        }),
      });

    case "MULTI":
      return z.object({
        ...baseSchema,
        options: z
          .array(
            z.object({
              isCorrect: z.boolean(),
              text: z.string().min(1, "Option text is required"),
              imageFile: z.any().optional(),
            })
          )
          .min(2, "At least two options are required")
          .refine((options) => options.some((opt) => opt.isCorrect), {
            message: "At least one option must be marked as correct",
          }),
        answerExplanationField: z.object(answerExplanationSchema),
      });

    case "SINGLE":
    default:
      return z.object({
        ...baseSchema,
        options: z
          .array(
            z.object({
              isCorrect: z.boolean(),
              text: z.string().min(1, "Option text is required"),
              imageFile: z.any().optional(),
            })
          )
          .min(2, "At least two options are required")
          .refine(
            (options) => options.filter((opt) => opt.isCorrect).length === 1,
            {
              message: "Exactly one option must be marked as correct",
            }
          ),
        answerExplanationField: z.object({
          ...answerExplanationSchema,
          value: z.string().optional(),
        }),
      });
  }
};

export function QuestionForm({
  name,
  examSubjectId,
  questions,
  setQuestions,
}: {
  name: string;
  examSubjectId: string;
  questions: QuestionFormState[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionFormState[]>>;
}) {
  const questionType = getQuestionType(name);
  const questionSchema = createQuestionSchema(questionType);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getDefaultValues = (): QuestionFormState => {
    const baseValues = {
      text: "",
      imageFile: null,
      chapterId: "",
      difficultyLevel: "EASY" as const,
    };

    if (questionType === "INTEGER") {
      return {
        ...baseValues,
        answerExplanationField: {
          text: "",
          value: "",
          explanation: "",
          imageFile: null,
        },
      };
    }

    return {
      ...baseValues,
      options: [
        { isCorrect: false, text: "", imageFile: null },
        { isCorrect: false, text: "", imageFile: null },
        { isCorrect: false, text: "", imageFile: null },
        { isCorrect: false, text: "", imageFile: null },
      ],

      answerExplanationField: {
        text: "",
        explanation: "",
        ...(questionType === "SINGLE" ? { value: "" } : {}),
        imageFile: null,
      },
    };
  };
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [editorInitialValue, setEditorInitialValue] = useState("");
const [isSubmit, setIsSubmit] = useState(false);

  const openLatexEditor = (fieldName: string) => {
    setCurrentField((prev) => fieldName);
    const currentValue = form.getValues(fieldName as "text");
    setEditorInitialValue((c) => currentValue);
    setIsEditorOpen(true);
  };

  const handleSaveLatex = (value: string) => {
    if (currentField) {
      form.setValue(currentField as keyof QuestionFormState, value, {
        shouldValidate: true,
      });
    }
  };
  const handleEdit = (index: number) => {
    const question = questions[index];
    form.reset(question);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    form.reset(getDefaultValues());
    setEditingIndex(null);
  };

  const form = useForm<QuestionFormState>({
    resolver: zodResolver(questionSchema),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const handleSingleCorrectChange = (selectedIndex: number) => {
    fields.forEach((_, index) => {
      form.setValue(`options.${index}.isCorrect`, index === selectedIndex);
    });
  };

  // const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  // const [examSubjectId, setExamSubjectId] = useState("");

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldPath: string
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const imageData = { file, previewUrl };

    // Update the form state with the local image data
    form.setValue(fieldPath as keyof QuestionFormState, imageData);
    // console.log(fieldPath as any);
    // console.log('form : ',form.getValues(fieldPath as any));
  };

  const handleDeleteImage = (fieldPath: string) => {
    // Clean up the object URL if it exists
    const currentValue = form.getValues(fieldPath as keyof QuestionFormState);
    if (
      currentValue &&
      typeof currentValue === "object" &&
      "previewUrl" in currentValue &&
      currentValue.previewUrl
    ) {
      URL.revokeObjectURL(currentValue.previewUrl);
    }

    // Set the field to null
    form.setValue(fieldPath as keyof QuestionFormState, null);
  };

const onSubmit = async (formData: QuestionFormState) => {
  setIsSubmit(true);

  const timeoutId = setTimeout(() => {
    try {
    if (editingIndex !== null) {
      setQuestions((prev) =>
        prev.map((q, i) => (i === editingIndex ? formData : q))
      );
      setEditingIndex(null);
    } else {
      setQuestions((prev) => [...prev, formData]);
    }

    // optional reset
    // form.reset(getDefaultValues());
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    setIsSubmit(false);
  }
  }, 1000);

  
};


  useEffect(() => {
    async function fetchData() {
      if (!examSubjectId) return;
      //   console.log(examSubjectId);
      try {
        const responseTypes = await fetch(
          `/api/v1/subjects/${examSubjectId}/chapters`
        );
        const responseTypesJson = await responseTypes.json();
        setChapters(responseTypesJson.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    }
    fetchData();
  }, [examSubjectId]);

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="p-4 flex w-full gap-6">
        <Card className="w-1/2 mx-auto">
          <CardHeader className="pb-4">
            <CardTitle>
              Create{" "}
              {questionType.charAt(0) + questionType.slice(1).toLowerCase()}{" "}
              Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="chapterId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Topic Name</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {chapters.map((chapter) => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {chapter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-2"
                          >
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="EASY" id="easy" />
                              <Label htmlFor="easy">Easy</Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="MEDIUM" id="medium" />
                              <Label htmlFor="medium">Medium</Label>
                            </div>
                            <div className="flex items-center gap-1">
                              <RadioGroupItem value="HARD" id="hard" />
                              <Label htmlFor="hard">Hard</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            onClick={() => openLatexEditor("text")}
                            {...field}
                            placeholder="Question Text"
                            className="min-h-20"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(e, "imageFile")
                              }
                              className="w-full"
                            />
                            <p className="text-sm text-gray-500">
                              {field.value?.previewUrl
                                ? field.value.previewUrl
                                : "No image uploaded"}
                            </p>
                            {field.value?.previewUrl && (
                              <div className="mt-2 flex items-center gap-2">
                                <Image
                                  src={field.value.previewUrl}
                                  alt="Uploaded preview"
                                  width={200}
                                  height={200}
                                  style={{ width: "auto", height: "auto" }}
                                  className="rounded-md border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size={"icon"}
                                  onClick={() => {
                                    handleDeleteImage("imageFile");
                                  }}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {questionType !== "INTEGER" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">
                        Options{" "}
                        {questionType === "MULTI"
                          ? "(Multiple correct)"
                          : "(Single correct)"}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            text: "",
                            isCorrect: false,
                            imageFile: null,
                          })
                        }
                        className="h-8 px-2"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="p-3">
                          <div className="grid grid-cols-[1fr,auto] gap-2">
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name={`options.${index}.text`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Option text"
                                    onClick={() =>
                                      openLatexEditor(`options.${index}.text`)
                                    }
                                  />
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`options.${index}.imageFile`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Upload Image</FormLabel>
                                    <FormControl>
                                      <div className="flex flex-col gap-2">
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleImageUpload(
                                              e,
                                              `options.${index}.imageFile`
                                            )
                                          }
                                          className="w-full"
                                        />
                                        <p className="text-sm text-gray-500">
                                          {field.value?.previewUrl
                                            ? field.value.previewUrl
                                            : "No image uploaded"}
                                        </p>
                                        {field.value?.previewUrl && (
                                          <div className="mt-2 flex items-center gap-2">
                                            <Image
                                              src={field.value.previewUrl}
                                              alt="Uploaded preview"
                                              width={200}
                                              height={200}
                                              style={{
                                                width: "auto",
                                                height: "auto",
                                              }}
                                              className="rounded-md border"
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size={"icon"}
                                              onClick={() => {
                                                handleDeleteImage(
                                                  `options.${index}.imageFile`
                                                );
                                              }}
                                              className="h-8 w-8 z-10"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col justify-between items-center">
                              <FormField
                                control={form.control}
                                name={`options.${index}.isCorrect`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      {questionType === "MULTI" ? (
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="w-4 h-4"
                                        />
                                      ) : (
                                        <input
                                          type="radio"
                                          checked={field.value}
                                          onChange={() =>
                                            handleSingleCorrectChange(index)
                                          }
                                          name="correctOption"
                                          className="w-4 h-4"
                                        />
                                      )}
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 2}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Section */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    Answer{" "}
                    {questionType === "INTEGER" ? "& Solution" : "Explanation"}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionType === "INTEGER" && (
                      <FormField
                        control={form.control}
                        name="answerExplanationField.value"
                        render={({ field }) => (
                          <Input {...field} placeholder="Numerical Answer" />
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="answerExplanationField.text"
                      render={({ field }) => (
                        <Input {...field} placeholder="Text" />
                      )}
                    />
                    {questionType === "SINGLE" && (
                      <FormField
                        control={form.control}
                        name="answerExplanationField.value"
                        render={({ field }) => (
                          <Input {...field} placeholder="Value" />
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="answerExplanationField.explanation"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Explanation"
                        className="min-h-20"
                        onClick={() => {
                          openLatexEditor("answerExplanationField.explanation");
                        }}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answerExplanationField.imageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solution Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  "answerExplanationField.imageFile"
                                )
                              }
                              className="w-full"
                            />
                            {field.value?.previewUrl && (
                              <div className="mt-2 flex items-center gap-2">
                                <Image
                                  src={field.value.previewUrl}
                                  alt="Uploaded preview"
                                  width={200}
                                  height={200}
                                  style={{ width: "auto", height: "auto" }}
                                  className="rounded-md border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size={"icon"}
                                  onClick={() => {
                                    handleDeleteImage(
                                      "answerExplanationField.imageFile"
                                    );
                                  }}
                                  className="h-8 w-8"
                                >
                                  {" "}
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="submit" className="flex-1" disabled={isSubmit}>
                    {editingIndex !== null
    ? "Update"
    : isSubmit
    ? "Adding..."
    : "Add"}{" "} Question
                  </Button>
                  {editingIndex !== null && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="w-1/2 mx-auto">
          <CardHeader className="pb-4">
            <CardTitle>Questions in {questionType} Choice Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <p>No questions added yet</p>
            ) : (
              questions.map((question, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start relative">
                      <div>
                        <h3 className="text-lg font-semibold text-wrap">
                          Q.{index + 1}{" "}
                          <MathJax inline dynamic>
                            {question.text}
                          </MathJax>
                        </h3>
                        {question.imageFile?.previewUrl && (
                          <Image
                            src={question.imageFile?.previewUrl}
                            alt="Uploaded Image"
                            width={400}
                            height={300}
                            style={{ width: "auto", height: "auto" }}
                            className="rounded-md border"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 absolute right-0 top-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(index)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(index)}
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {question.options?.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type={
                                questionType === "MULTI" ? "checkbox" : "radio"
                              }
                              checked={option.isCorrect}
                              className="w-4 h-4 text-wrap"
                              readOnly
                            />
                            <p>
                              <MathJax inline dynamic>
                                {option.text}
                              </MathJax>
                            </p>
                          </div>
                          {option.imageFile?.previewUrl && (
                            <Image
                              src={option.imageFile?.previewUrl}
                              alt="Uploaded Image"
                              width={200}
                              height={200}
                              style={{ width: "auto", height: "auto" }}
                              className="rounded-md border"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p>
                        <MathJax inline dynamic>
                          {question.answerExplanationField.text}
                        </MathJax>
                      </p>
                      <p>
                        <MathJax inline dynamic>
                          {question.answerExplanationField.value}
                        </MathJax>
                      </p>
                      <p>
                        <MathJax inline dynamic>
                          {question.answerExplanationField.explanation}
                        </MathJax>
                      </p>
                      {question.answerExplanationField.imageFile
                        ?.previewUrl && (
                        <div>
                          <Image
                            src={
                              question.answerExplanationField.imageFile
                                ?.previewUrl
                            }
                            alt="Uploaded Image"
                            width={200}
                            height={200}
                            style={{ width: "auto", height: "auto" }}
                            className="rounded-md border"
                            unoptimized={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
        <LatexEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          initialValue={editorInitialValue}
          onSave={handleSaveLatex}
        />
      </div>
    </MathJaxContext>
  );
}
