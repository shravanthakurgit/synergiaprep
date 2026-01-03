
import { db } from "@/lib/db"
import { $Enums } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { errorResponse, successResponse } from "@/lib/utils/api-responses";
import { GenerateReportInputValidationSchema } from "@/lib/utils/model-validation-schema";
import { checkAuthUser } from "@/lib/utils/auth-check-in-exam-api";
import { C } from "@upstash/redis/zmscore-0SAuWM0q";


export async function POST(request: Request, { params }: { params: Promise<{ examId: string }> }) {
    
    const authResponse = await checkAuthUser();
    if(authResponse) return authResponse;


    try {

        const body = await request.json();
        const validation = GenerateReportInputValidationSchema.safeParse(body);
        
        if (!validation.success) {
            return errorResponse("Invalid Input", 400, validation.error);
        }

        const {userId,userSubmissionId } = validation.data;

        const {examId} = await params;
        console.log("examId received : ", examId);

        const userSubmission = await db.userSubmission.findFirst({
            where: { id : userSubmissionId },
            include:{
                userAnswerPerQuestions: {
                    include: {
                        question: {
                            include: {
                                chapter: true,
                            }
                        },
                        chosenOptions: {
                            include: {
                                option: true,
                            }
                        }
                    }

                }
            }
        })

        const examAttempt = await db.examAttempt.findFirst({
            where: { userSubmissionId : userSubmissionId },
            include: {
                exam: {
                    include: {
                        examSections: {
                            include: {
                                questions: {
                                    include: {
                                        chapter: true,
                                }
                            }
                        }
                    }
                }
                },
            },
        })

        // console.log(examAttempt);
        // console.log(userSubmission);

        if (!examAttempt || !userSubmission) {
            return errorResponse("Exam attempt or submission not found",404);
        }

        const existingReport = await db.analysisReport.findFirst({
            where : {
                examAttemptId : examAttempt.id
            },
            include : {
                examAttempt : {
                    select : {
                        attemptedQuestions : true,
                        correctAnswers : true,
                        incorrectAnswers : true,
                        timeTaken : true                    
                    }
                }
            }
        })

        if(existingReport) {
            return successResponse(existingReport,'saved report fetched successfully',200); 
        }


        const examStats = await db.examStatistics.findUnique({
            where: { examId },
        })
      
        const report = generateReport(examAttempt, examStats, userSubmission);


        const savedReport = await db.analysisReport.create({
        data: {
            examAttemptId: examAttempt.id,
            ...report,
        },
        include : {
            examAttempt : {
                select : {
                    attemptedQuestions : true,
                    correctAnswers : true,
                    incorrectAnswers : true,
                    timeTaken : true                    
                }
            }
        }
        })

        return successResponse(savedReport,'report generated successfully',201);
    } catch (error) {
        console.error("Error generating report:", error);
        return errorResponse('Internal server error',500,error);
    }
}

function generateReport(examAttempt: { exam: { examSections: ({ questions: ({ chapter: { name: string; id: string; description: string | null; subjectId: string; }; } & { id: string; difficultyLevel: $Enums.DifficultyLevel; text: string | null; imageUrl: string | null; examSectionId: string | null; chapterId: string; })[]; } & { name: string | null; id: string; examId: string; description: string | null; isAllQuestionsMandatory: boolean | null; numberOfQuestionsToAttempt: number | null; sectionConfigId: string; })[]; } & { id: string; createdAt: Date; updatedAt: Date; title: string | null; instructions: string | null; description: string | null; totalDurationInSeconds: number | null; examType: string; examCategoryId: string; }; } & { id: string; userId: string; examId: string; score: number; percentile: number | null; rank: number | null; accuracy: number; attemptedQuestions: number; correctAnswers: number; incorrectAnswers: number; timeTaken: number; }, examStats: { id: string; examId: string; totalAttempts: number; averageScore: number; highestScore: number; lowestScore: number; medianScore: number; standardDeviation: number; averageTimeTaken: number; topPerformers: JsonValue; } | null, userSubmission: { userAnswerPerQuestions: ({ question: { chapter: { name: string; id: string; description: string | null; subjectId: string; }; } & { id: string; difficultyLevel: $Enums.DifficultyLevel; text: string | null; imageUrl: string | null; examSectionId: string | null; chapterId: string; }; chosenOptions: ({ option: { id: string; text: string | null; imageUrl: string | null; questionId: string; isCorrect: boolean; }; } & { id: string; optionId: string; userAnswerPerQuestionId: string; })[]; } & { id: string; value: string | null; isAttempted: boolean; userSubmissionId: string; questionId: string; })[]; } & { id: string; createdAt: Date; updatedAt: Date; userId: string; examId: string; }) {
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {}
    const difficultyPerformance: { [key: string]: boolean[] } = { EASY: [], MEDIUM: [], HARD: [] }
    userSubmission.userAnswerPerQuestions.forEach((answer) => {
        const chapter = answer.question.chapter.name;
        const difficulty = answer.question.difficultyLevel;
        if (!topicPerformance[chapter]) {
            topicPerformance[chapter] = { correct: 0, total: 0 }
        }
        topicPerformance[chapter].total++
        if(answer.chosenOptions.every((option) => option.option.isCorrect)) {
            topicPerformance[chapter].correct++
        }
        difficultyPerformance[difficulty].push(answer.chosenOptions.every((option) => option.option.isCorrect))
    });

  const topicWisePerformance = Object.entries(topicPerformance).map(([topic, data]) => ({
    topic,
    accuracy: (data.correct / data.total) * 100,
  }))

  const difficultyWisePerformance = Object.entries(difficultyPerformance).map(([difficulty, answers]) => ({
    difficulty,
    accuracy: answers.length > 0 ? (answers.filter(Boolean).length / answers.length) * 100 : 0,
  }))

  const strengths = topicWisePerformance.filter((topic) => topic.accuracy >= 70).map((topic) => topic.topic)

  const weaknesses = topicWisePerformance.filter((topic) => topic.accuracy < 50).map((topic) => topic.topic)

  return {
    overallPerformance: {
      score: examAttempt.score,
      percentile: examAttempt.percentile,
      rank: examAttempt.rank,
      accuracy: examAttempt.accuracy,
    },
    topicWisePerformance,
    difficultyWisePerformance,
    timeManagement: {
      totalTimeTaken: examAttempt.timeTaken,
      averageTimePerQuestion: examAttempt.timeTaken / examAttempt.attemptedQuestions,
    },
    strengthsAndWeaknesses: {
      strengths,
      weaknesses,
    },
    suggestedImprovements: weaknesses.map((topic) => `Focus on improving your understanding of ${topic}.`),
  }
}
