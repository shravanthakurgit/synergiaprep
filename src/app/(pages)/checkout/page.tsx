"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Course } from "@/type/course";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, Loader2 } from "lucide-react";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);



const [couponCode, setCouponCode] = useState("");
const [discount, setDiscount] = useState(0);
const [finalAmount, setFinalAmount] = useState(0);
const [couponError, setCouponError] = useState("");
const [applying, setApplying] = useState(false);
const [isValid, setIsValid] = useState(false)



  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/v1/courses/${courseId}`);
        const data = await response.json();
        setCourse(data.data || null);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [courseId]);


  const applyCoupon = async () => {
  if (!couponCode.trim()) return;

  setApplying(true);
  setCouponError("");

  const res = await fetch("/api/coupon/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    courseId: courseId,
    couponCode: couponCode.trim(),
  }),
});


  const data = await res.json();
  console.log("cpn err", data)

  if (!res.ok) {
    setCouponError(data.error || data.message || "Invalid coupon");
    setDiscount(0);
    setCouponCode("")
    setIsValid(false)
    setFinalAmount(course!.price);
  } else {
    setIsValid(true)
    setDiscount(data.discount);
    setFinalAmount(data.finalAmount);
  }

  setApplying(false);
};



  useEffect(() => {
  if (course) {
    setFinalAmount(course.price);
  }
}, [course]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading course details...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="mb-6">
          The course you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={() => router.push("/")}>Return to Courses</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Course Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <Image src={course.thumbnailUrl} alt={course.title} height={400} width={800} className="rounded-lg" />
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-md text-muted-foreground mb-4">
              {course.subtitle}
            </p>

            <div className="flex items-center mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mr-2">
                {course.examCategories.map((category) => category.name).join(", ")}
              </span>
              <span className="text-sm text-gray-500">
                {course.exams.map((exam) => exam.title).join(", ")}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500">
                {course.enrollmentCount} students
              </span>
            </div>
            <div className="mb-6">
              <p className="text-md mb-4">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span>₹{course.price}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>- ₹{discount > 0 ? discount : course.discount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{isValid ? finalAmount : (course.price - course.discount)}</span>
              </div>
            </div>



            {/* Coupon Code Apply */}

            <div className="mt-4">
  <div className="flex gap-2 flex-col flex-wrap  border-t-2 bg-gray-400/20 p-2 rounded-md">
    <p className="text-sm font-bold font-sans text-gray-600">Have A Coupon Code?</p>
    <input
      type="text"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      className="flex-1 border-2 border-gray-400/50  outline-none rounded px-3 py-2 text-sm focus:border-gray-700/60 transition-all duration-400"
    />
   {!isValid ?  <Button
      onClick={applyCoupon}
      disabled={applying}

      className="bg-green-800/80"
    >
      {applying ? "Applying..." : isValid && discount > 0 ? "Applied" : "Apply"}
    </Button> :  <Button
      onClick={()=>{
        setCouponCode("")
      setIsValid(false)}}
      className="bg-green-800/80"
    >
     Remove
    </Button>
    }
    
    

  </div>

  {couponError && (
    <p className=" text-center text-sm text-red-500 border border-red-600 p-2 mt-4 bg-red-600/10 rounded-md">{couponError}</p>
  )}

  { isValid && discount > 0  && (
    <p className=" font-semibold text-center text-xs text-green-600 bg-green-400/10 border border-green-600 rounded-md p-2 flex justify-center items-center gap-2 mt-3 ">
      Coupon Applied <CircleCheck size={15}/>
    </p>
  )}
</div>


            <div className="mt-4 w-full">
              <PaymentButton amount={isValid ? finalAmount : (course.price - course.discount)} courseId={course.id} couponCode={isValid ? couponCode : ""}/>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <h3 className="font-medium">Top-seller Success Rate</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {course.enrollmentCount > 5? `Join ${course.enrollmentCount} people in your country who recently enrolled in this
                course within the last 24 hours.`: `Be the first to enroll in this course!`}
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>Lifetime Access</p>
              <p>30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
