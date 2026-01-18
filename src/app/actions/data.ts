"use server";

import { db } from "@/lib/db";
import { RoleType } from "@prisma/client";
export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    }
    catch {
        return null;
    }

};
export const getUserById = async (id: string | undefined) => {
    if (!id) return null;
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            },
           include: {
        enrollments: {
          select: {
            id: true,
            courseId: true,
            userId:true,
          },
        },
      },
        });
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const createUser = async (data: {
  name: string;
  email: string;
    ph_no: string;
  emailVerified: Date;
  role?: string;
}) => {
  try {
    const user = await db.user.create({
      data: {
        ...data,
        role: (data.role ?? "USER") as RoleType, // Assign default role if not provided
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};


export const dbUpdateUsingPh = async (ph: string | undefined, data: { name: string, email: string }) => {
    try {
        const user = await db.user.update({
            where: {
                ph_no: ph,
            },
            data,
        });
        return user;
    }
    catch {
        return null;
    }

}
export const dbUpdateUsingEmail = async (email: string | undefined, data: { name: string, password:string}) => {
    try {
        const user = await db.user.update({
            where: {
                email: email,
            },
            data,
        });
        return user;
    }
    catch {
        return null;
    }

}

export const getOTPbyEmail = async (email:string | undefined) => {
    try {
        const otp = await db.oTP.findUnique({
            where: {
                email: email,
            },
        });
        return otp;
    }
    catch {
        return null;
    }

};

export const dbUpdateImgUsingId = async (id: string | undefined, data: { image: string | null }) => {
    try {
        const user = await db.user.update({
            where: {
                id,
            },
            data,
        });
        return user;
    }
    catch {
        return null;
    }

}

export const getImageById = async (id: string | undefined) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            },
        });
        return user?.image;
    }
    catch {
        return null;
    }

}

export const getExamsAccessableByAnUser = async(userId : string) => {

    try {
        
        const res = await db.enrollment.findMany({
            where : {
                userId
            },
            select : {
                course : {
                    select : {
                        courseExams : {
                            select : {
                                exam : {
                                    select : {
                                        id : true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const examIds = res.flatMap(enrollment => 
            enrollment.course?.courseExams?.flatMap(courseExam => 
                courseExam.exam?.id ? [courseExam.exam.id] : []
            ) || []
        );

        return examIds;

        
    } catch (error) {
        return [];
    }

}


export const isExamAccessableByUser = async(userId : string, examId : string) => {

    try {
        
        const res = await db.enrollment.findMany({
            where : {
                userId
            },
            select : {
                course : {
                    select : {
                        courseExams : {
                            select : {
                                exam : {
                                    select : {
                                        id : true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const examIds = res.flatMap(enrollment => 
            enrollment.course?.courseExams?.flatMap(courseExam => 
                courseExam.exam?.id ? [courseExam.exam.id] : []
            ) || []
        );

        return examIds.includes(examId);
        
    } catch (error) {
        return false;
    }

}
