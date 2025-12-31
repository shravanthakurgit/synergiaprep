'use server';

import { errorResponse, successResponse } from "@/lib/utils/api-responses";
import { db } from "@/lib/db";
import { UserSubmissionCreateValidationSchema } from "@/lib/utils/model-validation-schema";
import { NextRequest } from "next/server";
import { checkAuthAdmin, checkAuthUser } from "@/lib/utils/auth-check-in-exam-api";

export const GET = async (req: NextRequest) => {

    const authResponse = await checkAuthUser();
    if (authResponse) return authResponse;

    try {

        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get('user-id');
        const examId = searchParams.get('exam-id');

        const whereClause: { userId?: string, examId?: string } = {};
        if (userId) {
            whereClause.userId = userId;
        }
        if (examId) {
            whereClause.examId = examId;
        }


        const userSubmissions = await db.userSubmission.findMany({
            where: whereClause,
            include : {
                exam : {
                    select : {
                        id : true,
                        title : true
                    }
                }
            }
        })

        if (!userSubmissions) {
            return errorResponse("User submission not found", 404);
        }

        return successResponse(userSubmissions, "User submission fetched successfully", 200);

    } catch (error) {
        return errorResponse("Internal Server Error", 500, error);
    }

}






export const POST = async (req: NextRequest) => {

    const authResponse = await checkAuthUser();
    if (authResponse) return authResponse;    

    try {

        const body = await req.json();
        const validation = UserSubmissionCreateValidationSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Invalid Input", 400, validation.error);
        }


        const {
            userId,
            examId,
            userAnswerPerQuestions
        } = validation.data;


        // check user

        const existingUser = await db.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!existingUser) {
            return errorResponse("User not found", 404);
        }

        // check exam

        const existingExam = await db.exam.findUnique({
            where: {
                id: examId
            }
        })

        if (!existingExam) {
            return errorResponse("Exam not found", 404);
        }

        // create submission

        const userSubmission = await db.userSubmission.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                exam: {
                    connect: { id: examId }
                },
                userAnswerPerQuestions: {
                    create: userAnswerPerQuestions.map((userAnswerPerQuestion) => ({
                        value: userAnswerPerQuestion.value,
                        isAttempted: userAnswerPerQuestion.isAttempted,
                        question: {
                            connect: { id: userAnswerPerQuestion.questionId }
                        },
                        chosenOptions: {
                            create: userAnswerPerQuestion.chosenOptions?.map((userSelectedOption) => ({
                                option: {
                                    connect: { id: userSelectedOption.optionId }
                                }
                            }))
                        }
                    }))
                }
            }
        })

        return successResponse(userSubmission, "User Submission created successfully", 201);

    } catch (error) {
        return errorResponse("Internal Server Error", 500, error);
    }
}