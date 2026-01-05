import { db } from "@/lib/db";
import { $Enums, Prisma } from "@prisma/client";
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

    // Convert report data to Prisma.InputJsonValue with proper type assertion
    const createData: Prisma.AnalysisReportCreateInput = {
      examAttempt: {
        connect: { id: examAttempt.id },
      },
      overallPerformance:
        report.overallPerformance as unknown as Prisma.InputJsonValue,
      topicWisePerformance:
        report.topicWisePerformance as unknown as Prisma.InputJsonValue,
      difficultyWisePerformance:
        report.difficultyWisePerformance as unknown as Prisma.InputJsonValue,
      timeManagement: report.timeManagement as unknown as Prisma.InputJsonValue,
      strengthsAndWeaknesses:
        report.strengthsAndWeaknesses as unknown as Prisma.InputJsonValue,
      suggestedImprovements:
        report.suggestedImprovements as unknown as Prisma.InputJsonValue,
    };

    // Add scalar fields conditionally
    if (report.overallPerformance.score !== undefined) {
      createData.score = report.overallPerformance.score;
    }
    if (report.overallPerformance.percentile !== undefined) {
      createData.percentile = report.overallPerformance.percentile;
    }
    if (report.overallPerformance.rank !== undefined) {
      createData.rank = report.overallPerformance.rank;
    }
    if (report.overallPerformance.accuracy !== undefined) {
      createData.accuracy = report.overallPerformance.accuracy;
    }
    if (report.overallPerformance.totalQuestions !== undefined) {
      createData.totalQuestions = report.overallPerformance.totalQuestions;
    }
    if (report.overallPerformance.attemptedQuestions !== undefined) {
      createData.attemptedQuestions =
        report.overallPerformance.attemptedQuestions;
    }
    if (report.overallPerformance.correctAnswers !== undefined) {
      createData.correctAnswers = report.overallPerformance.correctAnswers;
    }
    if (report.overallPerformance.incorrectAnswers !== undefined) {
      createData.incorrectAnswers = report.overallPerformance.incorrectAnswers;
    }
    if (report.overallPerformance.unattemptedQuestions !== undefined) {
      createData.unattemptedQuestions =
        report.overallPerformance.unattemptedQuestions;
    }
    if (report.overallPerformance.maxMarks !== undefined) {
      createData.maxMarks = report.overallPerformance.maxMarks;
    }
    if (report.timeManagement.totalTimeTaken !== undefined) {
      createData.totalTimeTaken = report.timeManagement.totalTimeTaken;
    }
    if (report.timeManagement.averageTimePerQuestion !== undefined) {
      createData.averageTimePerQuestion =
        report.timeManagement.averageTimePerQuestion;
    }

    const savedReport = await db.analysisReport.create({
      data: createData,
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

// Define interfaces for the report structure with index signatures
interface TopicPerformance {
  topic: string;
  accuracy: number;
  questions: number;
  correct: number;
  [key: string]: unknown; // Add index signature for JSON compatibility
}

interface DifficultyPerformance {
  difficulty: string;
  accuracy: number;
  questions: number;
  correct: number;
  [key: string]: unknown; // Add index signature for JSON compatibility
}

interface OverallPerformance {
  score: number;
  percentile: number;
  rank: number;
  accuracy: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  maxMarks: number;
  [key: string]: unknown; // Add index signature for JSON compatibility
}

interface TimeManagement {
  totalTimeTaken: number;
  averageTimePerQuestion: number;
  [key: string]: unknown; // Add index signature for JSON compatibility
}

interface StrengthsAndWeaknesses {
  strengths: string[];
  weaknesses: string[];
  [key: string]: unknown; // Add index signature for JSON compatibility
}

interface GeneratedReport {
  overallPerformance: OverallPerformance;
  topicWisePerformance: TopicPerformance[];
  difficultyWisePerformance: DifficultyPerformance[];
  timeManagement: TimeManagement;
  strengthsAndWeaknesses: StrengthsAndWeaknesses;
  suggestedImprovements: string[];
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
    timeTaken: number;
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
): GeneratedReport {
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

  const topicWisePerformance: TopicPerformance[] = Object.entries(
    topicPerformance
  ).map(([topic, data]) => ({
    topic,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
    questions: data.total,
    correct: data.correct,
  }));

  const difficultyWisePerformance: DifficultyPerformance[] = Object.entries(
    difficultyPerformance
  ).map(([difficulty, answers]) => ({
    difficulty,
    accuracy:
      answers.length > 0
        ? (answers.filter(Boolean).length / answers.length) * 100
        : 0,
    questions: answers.length,
    correct: answers.filter(Boolean).length,
  }));

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
