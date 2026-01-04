import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuthUser } from "@/lib/utils/auth-check-in-exam-api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    let userId: string | undefined = undefined;
    if (!userId) {
      const usersIndex = parts.findIndex((p) => p === "users");
      if (usersIndex !== -1 && parts.length > usersIndex + 1) {
        userId = parts[usersIndex + 1];
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing user id in request" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch total study hours from DB
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { studyHours: true }, 
    });

    return NextResponse.json({
      hours: user?.studyHours || 0,
      userId,
      source: "db",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResponse = await checkAuthUser();
    
      if(authResponse) return authResponse;
    const { userId, minutes } = await request.json();

    if (!userId || typeof minutes !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Update study hours
    const user = await db.user.update({
      where: { id: userId },
      data: {
        studyHours: { increment: + minutes }, // store in hours
      },
      select: { studyHours: true },
    });

    return NextResponse.json({
      hours: user.studyHours,
      userId,
      addedMinutes: minutes,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
