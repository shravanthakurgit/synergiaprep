import { db } from "@/lib/db";
import { $Enums } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { errorResponse, successResponse } from "@/lib/utils/api-responses";
import { GenerateReportInputValidationSchema } from "@/lib/utils/model-validation-schema";
import { checkAuthUser } from "@/lib/utils/auth-check-in-exam-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const authResponse = await checkAuthUser();
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const validation = GenerateReportInputValidationSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse("Invalid Input", 400, validation.error);
    }

    const { userId, userSubmissionId } = validation.data;
    const { examId } = await params;
    console.log("examId received : ", examId);

    const userSubmission = await db.userSubmission.findFirst({
      where: { id: userSubmissionId },
      include: {
        userAnswerPerQuestions: {
          include: {
            question: {
              include: {
                chapter: true,
              },
            },
            chosenOptions: {
              include: {
                option: true,
              },
            },
          },
        },
      },
    });

    const examAttempt = await db.examAttempt.findFirst({
      where: { userSubmissionId: userSubmissionId },
      include: {
        exam: {
          include: {
            examSections: {
              include: {
                questions: {
                  include: {
                    chapter: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!examAttempt || !userSubmission) {
      return errorResponse("Exam attempt or submission not found", 404);
    }

    const existingReport = await db.analysisReport.findFirst({
      where: {
        examAttemptId: examAttempt.id,
      },
      include: {
        examAttempt: {
          select: {
            attemptedQuestions: true,
            correctAnswers: true,
            incorrectAnswers: true,
            timeTaken: true,
          },
        },
      },
    });

    if (existingReport) {
      return successResponse(
        [existingReport],
        "saved report fetched successfully",
        200
      );
    }

    const examStats = await db.examStatistics.findUnique({
      where: { examId },
    });

    const report = generateReport(examAttempt, examStats, userSubmission);

    const savedReport = await db.analysisReport.create({
      data: {
        examAttemptId: examAttempt.id,

        // Use JSON field for overallPerformance which contains everything
        overallPerformance: report.overallPerformance as any,
        topicWisePerformance: report.topicWisePerformance as any,
        difficultyWisePerformance: report.difficultyWisePerformance as any,
        timeManagement: report.timeManagement as any,
        strengthsAndWeaknesses: report.strengthsAndWeaknesses as any,
        suggestedImprovements: report.suggestedImprovements as any,

        // Only add structured fields if they exist in the schema
        ...(report.overallPerformance.score !== undefined && {
          score: report.overallPerformance.score,
        }),
        ...(report.overallPerformance.percentile !== undefined && {
          percentile: report.overallPerformance.percentile,
        }),
        ...(report.overallPerformance.rank !== undefined && {
          rank: report.overallPerformance.rank,
        }),
        ...(report.overallPerformance.accuracy !== undefined && {
          accuracy: report.overallPerformance.accuracy,
        }),
        ...(report.overallPerformance.totalQuestions !== undefined && {
          totalQuestions: report.overallPerformance.totalQuestions,
        }),
        ...(report.overallPerformance.attemptedQuestions !== undefined && {
          attemptedQuestions: report.overallPerformance.attemptedQuestions,
        }),
        ...(report.overallPerformance.correctAnswers !== undefined && {
          correctAnswers: report.overallPerformance.correctAnswers,
        }),
        ...(report.overallPerformance.incorrectAnswers !== undefined && {
          incorrectAnswers: report.overallPerformance.incorrectAnswers,
        }),
        ...(report.overallPerformance.unattemptedQuestions !== undefined && {
          unattemptedQuestions: report.overallPerformance.unattemptedQuestions,
        }),
        ...(report.overallPerformance.maxMarks !== undefined && {
          maxMarks: report.overallPerformance.maxMarks,
        }),
        ...(report.timeManagement.totalTimeTaken !== undefined && {
          totalTimeTaken: report.timeManagement.totalTimeTaken,
        }),
        ...(report.timeManagement.averageTimePerQuestion !== undefined && {
          averageTimePerQuestion: report.timeManagement.averageTimePerQuestion,
        }),
      },
      include: {
        examAttempt: {
          select: {
            attemptedQuestions: true,
            correctAnswers: true,
            incorrectAnswers: true,
            timeTaken: true,
          },
        },
      },
    });

    return successResponse([savedReport], "report generated successfully", 201);
  } catch (error) {
    console.error("Error generating report:", error);
    return errorResponse("Internal server error", 500, error);
  }
}

function generateReport(
  examAttempt: {
    exam: {
      examSections: ({
        questions: ({
          chapter: {
            name: string;
            id: string;
            description: string | null;
            subjectId: string;
          };
        } & {
          id: string;
          difficultyLevel: $Enums.DifficultyLevel;
          text: string | null;
          imageUrl: string | null;
          examSectionId: string | null;
          chapterId: string;
        })[];
      } & {
        name: string | null;
        id: string;
        examId: string;
        description: string | null;
        isAllQuestionsMandatory: boolean | null;
        numberOfQuestionsToAttempt: number | null;
        sectionConfigId: string;
      })[];
    } & {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      title: string | null;
      instructions: string | null;
      description: string | null;
      totalDurationInSeconds: number | null;
      examType: string;
      examCategoryId: string;
    };
  } & {
    id: string;
    userId: string;
    examId: string;
    score: number;
    percentile: number | null;
    rank: number | null;
    accuracy: number;
    attemptedQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTaken: number; // This is in seconds
  },
  examStats: {
    id: string;
    examId: string;
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    medianScore: number;
    standardDeviation: number;
    averageTimeTaken: number;
    topPerformers: JsonValue;
  } | null,
  userSubmission: {
    userAnswerPerQuestions: ({
      question: {
        chapter: {
          name: string;
          id: string;
          description: string | null;
          subjectId: string;
        };
      } & {
        id: string;
        difficultyLevel: $Enums.DifficultyLevel;
        text: string | null;
        imageUrl: string | null;
        examSectionId: string | null;
        chapterId: string;
      };
      chosenOptions: ({
        option: {
          id: string;
          text: string | null;
          imageUrl: string | null;
          questionId: string;
          isCorrect: boolean;
        };
      } & {
        id: string;
        optionId: string;
        userAnswerPerQuestionId: string;
      })[];
    } & {
      id: string;
      value: string | null;
      isAttempted: boolean;
      userSubmissionId: string;
      questionId: string;
    })[];
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    examId: string;
  }
) {
  // Calculate total questions from the exam structure
  let totalQuestions = 0;
  examAttempt.exam.examSections.forEach((section) => {
    totalQuestions += section.questions.length;
  });

  const topicPerformance: {
    [key: string]: { correct: number; total: number };
  } = {};
  const difficultyPerformance: { [key: string]: boolean[] } = {
    EASY: [],
    MEDIUM: [],
    HARD: [],
  };

  userSubmission.userAnswerPerQuestions.forEach((answer) => {
    const chapter = answer.question.chapter.name;
    const difficulty = answer.question.difficultyLevel;

    if (!topicPerformance[chapter]) {
      topicPerformance[chapter] = { correct: 0, total: 0 };
    }

    topicPerformance[chapter].total++;

    // Check if the answer is correct (all chosen options are correct)
    const isCorrect =
      answer.chosenOptions.length > 0 &&
      answer.chosenOptions.every((option) => option.option.isCorrect);

    if (isCorrect) {
      topicPerformance[chapter].correct++;
    }

    difficultyPerformance[difficulty].push(isCorrect);
  });

  const topicWisePerformance = Object.entries(topicPerformance).map(
    ([topic, data]) => ({
      topic,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      questions: data.total,
      correct: data.correct,
    })
  );

  const difficultyWisePerformance = Object.entries(difficultyPerformance).map(
    ([difficulty, answers]) => ({
      difficulty,
      accuracy:
        answers.length > 0
          ? (answers.filter(Boolean).length / answers.length) * 100
          : 0,
      questions: answers.length,
      correct: answers.filter(Boolean).length,
    })
  );

  const strengths = topicWisePerformance
    .filter((topic) => topic.accuracy >= 70)
    .map((topic) => topic.topic);
  const weaknesses = topicWisePerformance
    .filter((topic) => topic.accuracy < 50)
    .map((topic) => topic.topic);

  // Calculate unattempted questions
  const unattemptedQuestions = Math.max(
    0,
    totalQuestions - examAttempt.attemptedQuestions
  );

  // Calculate accuracy as percentage (0-100) to match frontend expectation
  const accuracyPercentage =
    examAttempt.attemptedQuestions > 0
      ? (examAttempt.correctAnswers / examAttempt.attemptedQuestions) * 100
      : 0;

  // Ensure score is a percentage (if it's stored as raw count, convert it)
  const scorePercentage =
    examAttempt.score > 100
      ? (examAttempt.correctAnswers / totalQuestions) * 100
      : examAttempt.score;

  return {
    overallPerformance: {
      score: scorePercentage, // Percentage score (0-100)
      percentile: examAttempt.percentile || 0,
      rank: examAttempt.rank || 0,
      accuracy: accuracyPercentage / 100, // Convert to decimal (0-1) for frontend
      totalQuestions: totalQuestions,
      attemptedQuestions: examAttempt.attemptedQuestions,
      correctAnswers: examAttempt.correctAnswers,
      incorrectAnswers: examAttempt.incorrectAnswers,
      unattemptedQuestions: unattemptedQuestions,
      maxMarks: 100, // Assuming 100 is max marks
    },
    topicWisePerformance,
    difficultyWisePerformance,
    timeManagement: {
      totalTimeTaken: examAttempt.timeTaken, // in seconds
      averageTimePerQuestion:
        examAttempt.attemptedQuestions > 0
          ? examAttempt.timeTaken / examAttempt.attemptedQuestions
          : 0, // in seconds
    },
    strengthsAndWeaknesses: {
      strengths,
      weaknesses,
    },
    suggestedImprovements: weaknesses.map(
      (topic) => `Focus on improving your understanding of ${topic}.`
    ),
  };
}
