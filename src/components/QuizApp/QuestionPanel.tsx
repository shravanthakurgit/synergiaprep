import React from "react";
import { Button } from "@/components/ui/button";
import { Exam } from "@/types/examTypes";

interface QuestionPanelProps {
  Exam: Exam;
  currentQuestion: [number, number];
  setCurrentQuestion: (q: [number, number]) => void;
  visitedQuestions: Set<string>;
  setVisitedQuestions: (visited: Set<string>) => void;
  getQuestionStatus: (
    sectionNumber: number,
    questionNumber: number,
    questionId: string
  ) => string;
}

const sectionCategoryMap = {
  NEET_SECTION_SINGLE_CHOICE_MCQ_TYPE_B_ATTEMPT_ANY: "CATEGORY 1",
  NEET_SECTION_SINGLE_CHOICE_MCQ_TYPE_A_ALL_MANDATORY: "CATEGORY 2",
  WBJEE_SECTION_SINGLE_CHOICE_MCQ_TYPE_1: "CATEGORY 1",
  WBJEE_SECTION_SINGLE_CHOICE_MCQ_TYPE_2: "CATEGORY 2",
  WBJEE_SECTION_MULTI_CHOICE_MCQ: "CATEGORY 3",
} as const;

type SectionCategoryKey = keyof typeof sectionCategoryMap;

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  Exam,
  currentQuestion,
  setCurrentQuestion,
  visitedQuestions,
  setVisitedQuestions,
  getQuestionStatus,
}) => {
  // Status indicators with their descriptions and colors
  const statusIndicators = [
    { status: "Not Visited", color: "bg-gray-400", textColor: "text-gray-600" },
    { status: "Not Answered", color: "bg-red-600", textColor: "text-red-600" },
    { status: "Answered", color: "bg-green-500", textColor: "text-green-600" },
    {
      status: "Marked for Review",
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      status: "Marked & Saved",
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg h-full w-full">
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
        {statusIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-3 h-3 ${indicator.color} rounded-full mr-1`}
            ></div>
            <span className={`text-xs font-medium ${indicator.textColor}`}>
              {indicator.status}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
        {Exam?.examSections.map((section, i) => (
          <div key={i} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">
              {section.name in sectionCategoryMap
                ? sectionCategoryMap[section.name as SectionCategoryKey]
                : section.name}
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {section.questions.map((question, j) => {
                const status = getQuestionStatus(i, j, question.id);
                let buttonStyle = "";

                switch (status) {
                  case "not-visited":
                    buttonStyle =
                      "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
                    break;
                  case "not-answered":
                    buttonStyle =
                      "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
                    break;
                  case "answered":
                    buttonStyle =
                      "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
                    break;
                  case "review":
                    buttonStyle =
                      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
                    break;
                  case "answered-marked":
                    buttonStyle =
                      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
                    break;
                  default:
                    buttonStyle =
                      "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
                }

                const isActive =
                  currentQuestion[0] === i && currentQuestion[1] === j;

                return (
                  <Button
                    key={j}
                    variant="outline"
                    className={`w-10 h-10 p-0 font-medium border ${buttonStyle} ${
                      isActive ? "ring-2 ring-indigo-500" : ""
                    }`}
                    onClick={() => {
                      setCurrentQuestion([i, j]);
                      setVisitedQuestions(
                        new Set([...visitedQuestions, `${i}-${j}`])
                      );
                    }}
                  >
                    {j + 1}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPanel;
