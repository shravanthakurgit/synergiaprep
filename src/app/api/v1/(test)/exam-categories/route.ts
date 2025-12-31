'use server';

import { errorResponse, successResponse } from "@/lib/utils/api-responses";
import { db } from "@/lib/db";
import { ExamCategoryCreateValidationSchema } from "@/lib/utils/model-validation-schema";
import { transformExamCategoryResponse } from "@/lib/utils/utility_functions";
import { NextRequest } from "next/server";
import { checkAuthAdmin, checkAuthUser } from "@/lib/utils/auth-check-in-exam-api";

export const GET = async (req: NextRequest) => {

    const authResponse = await checkAuthUser();
    if(authResponse) return authResponse;

    try {

        const allExamCategoriesDB = await db.examCategory.findMany({
            include: {
                subjectToExamCategories: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        const allExamCategories = allExamCategoriesDB.map(transformExamCategoryResponse);

        return successResponse(allExamCategories, "All exam Categories", 200);

    } catch (error) {
        return errorResponse("Internal Server Error", 500, error);
    }

}

export const POST = async (req: NextRequest) => {

    // const authResponse = await checkAuthAdmin();
    // if(authResponse) return authResponse;

    try {

        const body = await req.json();
        const validation = ExamCategoryCreateValidationSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse("Invalid Input", 400, validation.error);
        }

        const { name, description, eligibility, cutoffs, examPattern, subjectIds } = validation.data;

        const examCategoryDB = await db.examCategory.create({
            data: {
                name,
                description,
                eligibility,
                cutoffs,
                examPattern,
                subjectToExamCategories: {
                    create: subjectIds.map((subjectId) => ({
                        subject: {
                            connect: { id: subjectId }
                        }
                    }))
                }
            },
            include: {
                subjectToExamCategories: {
                    include: {
                        subject: true
                    }
                }
            }
        });


        const examCategory = transformExamCategoryResponse(examCategoryDB);

        return successResponse(examCategory, "examCategory created successfully", 201);


    } catch (error) {
        return errorResponse("Internal Server Error", 500, error);
    }

}

