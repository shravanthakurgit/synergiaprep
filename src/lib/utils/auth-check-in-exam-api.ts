import { auth } from "@/auth";
import { RoleType } from "@prisma/client";
import { errorResponse } from "./api-responses";


export async function checkAuthUser(){
    const session = await auth();
        // Check authentication
    if (!session) {
        return errorResponse("Not authenticated",401);
    }
    return null;
}

export async function checkAuthAdmin(){
    const session = 
    
    await auth();
        // Check authentication
    if (!session) {
        return errorResponse("Not authenticated",401);
    }

    const userRole = session.user?.role?.toUpperCase();

    if (userRole as RoleType !== RoleType.ADMIN && userRole as RoleType !== RoleType.SUPERADMIN) {
        return errorResponse("Not found",404);
    }

    return null;

}

export async function checkAuthSuperAdmin(){
    const session = await auth();
        // Check authentication
    if (!session) {
        return errorResponse("Not authenticated",401);
    }

    const userRole = session.user?.role?.toUpperCase();

    if (userRole as RoleType !== RoleType.SUPERADMIN) {
        return errorResponse("Not found",404);
    }

    return null;
}
