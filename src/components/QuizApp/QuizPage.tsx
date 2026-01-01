import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Flag,
  Save,
} from "lucide-react";
import QuestionPanel from "./QuestionPanel";
import { Exam, OptionSelection } from "@/types/examTypes";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";

interface QuizPageProps {
  Exam: Exam;
  currentQuestion: [number, number];
  setCurrentQuestion: (q: [number, number]) => void;
  currentanswer: {
    value?: string;
    questionId: string;
    chosenOptions?: OptionSelection[];
  } | null;
  handleAnswer: (
    sectionIndex: number,
    questionIndex: number,
    optionIndex?: number,
    value?: string
  ) => void;
  handleSaveAndNext: () => void;
  handleClearAnswer: () => void;
  handleMarkForReview: () => void;
  handleNextQuestion: () => void;
  handlePrevQuestion: () => void;
  setCurrentStep: (step: string) => void;
  session: { userId: string };
  visitedQuestions: Set<string>;
  setVisitedQuestions: (visited: Set<string>) => void;
  getQuestionStatus: (
    sectionNumber: number,
    questionNumber: number,
    questionId: string
  ) => string;
  updateCurrentAnswer: (value: string) => void;
}

const Numpad: React.FC<{
  value: string;
  onChange: (newVal: string) => void;
}> = ({ value, onChange }) => {
  const handleClick = (digit: string) => onChange(value + digit);
  const handleBackspace = () => onChange(value.slice(0, -1));

  return (
    <div className="mt-6">
      <input
        type="text"
        readOnly
        value={value}
        className="mb-4 w-full p-3 rounded-lg text-center text-lg font-medium bg-gray-50 border border-gray-200"
      />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            onClick={() => handleClick(digit.toString())}
            variant="outline"
            className="h-14 text-lg font-medium hover:bg-gray-100"
          >
            {digit}
          </Button>
        ))}
        <Button
          onClick={handleBackspace}
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-gray-100"
        >
          Back
        </Button>
        <Button
          onClick={() => handleClick("0")}
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-gray-100"
        >
          0
        </Button>
        <Button
          onClick={() => onChange("")}
          variant="outline"
          className="h-14 text-lg font-medium hover:bg-gray-100"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

const QuizPage: React.FC<QuizPageProps> = ({
  Exam,
  currentQuestion,
  setCurrentQuestion,
  currentanswer,
  handleAnswer,
  handleSaveAndNext,
  handleClearAnswer,
  handleMarkForReview,
  handleNextQuestion,
  handlePrevQuestion,
  setCurrentStep,
  session,
  visitedQuestions,
  setVisitedQuestions,
  getQuestionStatus,
  updateCurrentAnswer,
}) => {
  const currentSectionData = Exam?.examSections?.[currentQuestion[0]];
  const currentQuestionData = currentSectionData?.questions?.[currentQuestion[1]];

  // Return early if exam data is not ready
  if (!Exam?.examSections?.length || !currentSectionData || !currentQuestionData) {
    return <div className="bg-white min-h-screen flex items-center justify-center">Loading question...</div>;
  }

  const isNumerical = currentQuestionData.options.length === 0;
  const isMultipleChoice =
    !isNumerical && currentSectionData.sectionConfig.partialMarks.length > 1;

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 flex">
        {/* Main content area - fixed at 75% on large screens */}
        <div className="w-full lg:w-3/4 pr-0 lg:pr-6 border-r-2">
          <Card className="border-0 rounded-xl shadow-none overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    Section: {currentSectionData.name}
                  </span>
                  <h2 className="text-xl font-bold mt-2">
                    Question {currentQuestion[1] + 1} of{" "}
                    {currentSectionData.questions.length}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Menu className="h-5 w-5 mr-2" />
                        Questions
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Question Panel</SheetTitle>
                        <SheetDescription>
                          Navigate through questions using this panel.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-4">
                        <QuestionPanel
                          Exam={Exam}
                          currentQuestion={currentQuestion}
                          setCurrentQuestion={setCurrentQuestion}
                          visitedQuestions={visitedQuestions}
                          setVisitedQuestions={setVisitedQuestions}
                          getQuestionStatus={getQuestionStatus}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              <MathJaxContext>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-800 text-lg">
                    <MathJax
                      inline
                    >{currentQuestionData.text}</MathJax>
                    {currentQuestionData.imageUrl  && <Image
                      src={currentQuestionData.imageUrl || ""}
                      alt="Uploaded Image"
                      width={400}
                      height={300}
                      style={{ width: "auto", height: "auto" }}
                      className="rounded-md border"
                    />}
                  </div>

                  {isNumerical ? (
                    <Numpad
                      value={currentanswer?.value || ""}
                      onChange={(newVal) => updateCurrentAnswer(newVal)}
                    />
                  ) : (
                    <div className="space-y-3 mt-4">
                      {currentQuestionData.options.map((option, index) => (
                        <div 
                        key={index}
                        className={`w-full gap-2 justify-start text-left min-h-[56px] py-4 px-5 rounded-lg text-md font-medium ${currentanswer?.chosenOptions?.some(
                          (opt) => opt.optionId === option.id
                        )
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-700"
                          }`} onClick={() =>
                          handleAnswer(
                            currentQuestion[0],
                            currentQuestion[1],
                            index
                          )
                        }>
                          <div
                            key={index}
                            // variant={
                            //   currentanswer?.chosenOptions?.some(
                            //     (opt) => opt.optionId === option.id
                            //   )
                            //     ? "default"
                            //     : "outline"
                            // }
                            // className={`w-full justify-start text-left min-h-[56px] py-4 px-5 rounded-lg text-md font-medium ${currentanswer?.chosenOptions?.some(
                            //   (opt) => opt.optionId === option.id
                            // )
                            //   ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            //   : "text-gray-700 hover:bg-gray-200 hover:text-gray-700"
                            //   }`}
                            
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full border border-current">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <MathJax inline>{option.text}</MathJax>
                          </div>
                          {option.imageUrl  &&
                            <Image
                              src={option.imageUrl || ""}
                              alt="Uploaded Image"
                              width={200}
                              height={200}
                              style={{ width: "auto", height: "auto" }}
                              className="rounded-md border"
                            />
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </MathJaxContext>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    onClick={handleSaveAndNext}
                  >
                    <Save size={16} />
                    Save & Next
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50 gap-2"
                    onClick={handleClearAnswer}
                  >
                    <X size={16} />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    className="text-amber-600 hover:text-amber-600 border-amber-200 hover:bg-amber-50 gap-2"
                    onClick={handleMarkForReview}
                  >
                    <Flag size={16} />
                    Review
                  </Button>
                  <Button
                    variant="outline"
                    className="text-purple-600 hover:text-purple-600 border-purple-200 hover:bg-purple-50 gap-2"
                    onClick={handleMarkForReview}
                  >
                    <CheckCircle size={16} />
                    Mark & Next
                  </Button>
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handlePrevQuestion}
                    >
                      <ChevronLeft size={16} /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleNextQuestion}
                    >
                      Next <ChevronRight size={16} />
                    </Button>
                  </div>

                  <Button
                    variant="default"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setCurrentStep("summary")}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed width sidebar - always 25% on large screens */}
        <div className="hidden lg:block w-1/4">
          <div className="bg-white p-5 rounded-xl border-0 w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Question Panel
            </h3>
            <QuestionPanel
              Exam={Exam}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              visitedQuestions={visitedQuestions}
              setVisitedQuestions={setVisitedQuestions}
              getQuestionStatus={getQuestionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
