import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuthAdmin } from "@/lib/utils/auth-check-in-exam-api";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
      const authResponse = await checkAuthAdmin();
  if (authResponse) return authResponse;
    const data = await req.json();

    const coupon = await db.coupon.update({
      where: { id: params.id },
      data: {
        fixedDiscount: Number(data.fixedDiscount),
        minOrderAmount: Number(data.minOrderAmount),
        validTill: data.validTill ? new Date(data.validTill) : null,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(coupon);
  } catch {
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {

    const authResponse = await checkAuthAdmin();
  if (authResponse) return authResponse;
  try {
    await db.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
