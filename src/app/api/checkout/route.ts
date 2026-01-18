// import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   try {
//     const { courseId } = await request.json()

//     // In a real application, you would:
//     // 1. Validate the course exists
//     // 2. Check if the user is authenticated
//     // 3. Create a checkout session with your payment provider (Stripe, Razorpay, etc.)

//     // For demo purposes, we'll simulate creating a checkout URL
//     // In production, you would integrate with a payment gateway API

//     // Simulate processing time
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // Return a mock checkout URL
//     // In production, this would be the URL from your payment gateway
//     return NextResponse.json({
//       success: true,
//       checkoutUrl: `/checkout?courseId=${courseId}&session=demo-${Date.now()}`,
//     })
//   } catch (error) {
//     console.error("Checkout error:", error)
//     return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
//   }
// }

// /src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, courseId, courseTitle } = body;

    // Validate required fields
    if (!amount || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount or courseId' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${courseId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        courseTitle: courseTitle || 'SynergiaPrep Course',
      },
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // Send to frontend
    });

 } catch (error: unknown) {
  console.error('Razorpay API Error:', error);

  const message =
    error instanceof Error
      ? error.message
      : 'Failed to create payment order';

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

}

// Test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Razorpay Checkout API is working',
    status: 'online',
    gateway: 'Razorpay'
  });
}