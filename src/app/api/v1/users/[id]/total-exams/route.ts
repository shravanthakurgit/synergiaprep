import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const totalExams = await db.exam.count();


    return NextResponse.json({
        totalExams,
    });
  } catch (error) {
    console.error("Error fetching exam attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
