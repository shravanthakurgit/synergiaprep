import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Defensive userId extraction (same pattern as your reference)
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    let id: string | undefined;

    const usersIndex = parts.findIndex((p) => p === "users");
    if (usersIndex !== -1 && parts.length > usersIndex + 1) {
      id = parts[usersIndex + 1];
    }

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id in request" },
        { status: 400 }
      );
    }

    // Optional test override: ?mockCount=5
    const mockCount = url.searchParams.get("mockCount");
    if (mockCount !== null) {
      return NextResponse.json({
        totalAttempts: Number(mockCount) || 0,
        userId: id,
        source: "mockQuery",
      });
    }

    // Fetch ONLY ExamAttempt field
    const user = await db.user.findUnique({
      where: { id },
      select: {
        UserSubmission: {
          select: { id: true }, // minimal payload
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const totalAttempts = user.UserSubmission.length;

    return NextResponse.json({
      totalAttempts,
      userId: id,
      source: "db",
    });
  } catch (error) {
    console.error("Error fetching exam attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
