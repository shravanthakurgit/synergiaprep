import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(req: Request) {
  try{
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const amount = Number(searchParams.get("amount"));

    // Validate required parameters
    if (!courseId) {
      return NextResponse.json(
        { error: true, message: "Course ID is required" },
        { status: 400 }
      );
    }

    if (isNaN(amount)) {
      return NextResponse.json(
        { error: true, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Fetch course from database to validate its price
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { price: true, title: true }
    });

    if (!course) {
      return NextResponse.json(
        { error: true, message: "Course not found" },
        { status: 404 }
      );
    }

    // Validate that provided amount matches course price
    if (course.price !== amount) {
      return NextResponse.json(
        { 
          error: true, 
          message: `Amount mismatch. Course price is ${course.price}, but provided amount is ${amount}` 
        },
        { status: 400 }
      );
    }


    // FREE COURSE
    if (amount === 0) {

       const order ={
        course,
      amount: 0,
      currency: "INR",
      receipt: uuid(),
      free:true,
    };

      return NextResponse.json({
        order
      });
    }

    // PAID COURSE
    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: uuid(),
    });

    return NextResponse.json({
      free: false,
      order,
    });

  } catch (err) {
    console.error("Order create error:", err);
    return NextResponse.json(
      { error: true, message: "Server error" },
      { status: 500 }
    );
  }
}
