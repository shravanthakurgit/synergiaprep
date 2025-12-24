// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useSession } from "next-auth/react";
// import { Course } from "@/type/course";
// import { Skeleton } from "@/components/ui/skeleton";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Page() {
//   const { data: session } = useSession();
//   const [courses, setCourses] = useState<Course[] | null>(null);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//   useEffect(() => {
//     async function fetchCourses() {
//       try {
//         const response = await fetch(`/api/v1/courses/users/${userid}`);
//         const data = await response.json();
//         setCourses(data.data);
//       } catch (error) {
//         console.log("Error fetching courses:", error);
//       }
//     }

//     const userid = session?.user.id;
//     if (!userid) {
//       console.log("User ID is not available.");
//       return;
//     }
//     fetchCourses();
//   }, [session?.user.id]);

//   const handleCardClick = (course: Course) => {
//     setSelectedCourse(course);
//   };

//   const handleCloseOverlay = () => {
//     setSelectedCourse(null);
//   };

//   return (
//     <div className="flex-1 min-h-screen bg-gradient-to-b from-blue-400 to-gray-200 pt-6">
//       <main className="p-8 space-y-8 max-w-7xl mx-auto">
//         {/* Featured Courses */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-bold mb-6 text-black">Featured Courses</h2>
//           <div className="flex justify-center gap-6">
//             <Card
//               className="transform hover:scale-105 hover:shadow-xl cursor-pointer transition-all duration-300 w-80 bg-white rounded-xl"
//               onClick={() =>
//                 handleCardClick({
//                   id: "1",
//                   title: "SynergiaPrep WBJEE Practice Platform",
//                   subtitle: "Smart Practice. Smarter Strategy. Sure Success.",
//                   level: "Competitive",
//                   examCategories: [
//                     { id: "cat1", name: "Physics" },
//                     { id: "cat2", name: "Chemistry" },
//                     { id: "cat3", name: "Mathematics" },
//                   ],
//                   image: "/assets/images/jee_course.jpg",
//                   price: 0,
//                   modeOfLearning: "Online",
//                   courseContent: `SynergiaPrep’s WBJEE preparation platform is designed for students who want to practice more, track progress intelligently, and crack WBJEE with confidence. Instead of traditional coaching, we offer a self-paced, AI/ML-powered environment for unlimited practice and strategic preparation.

// Key Features:
// - Unlimited Chapter-Wise Practice: Strengthen Physics, Chemistry, and Mathematics concepts through structured chapter-wise tests.
// - Previous Year Question Papers (PYQ): Practice with authentic WBJEE PYQs for real exam exposure.
// - Expert-Designed Mock Tests: Full-length mock exams created by JU toppers and faculty with 15+ years’ experience.
// - Daily Quizzes & Brainstorming Sessions: Sharpen problem-solving skills with regular challenges.
// - AI/ML-Driven Progress Tracking: Identify strengths, weaknesses, and learning gaps with smart analytics.
// - Personalized Study Roadmaps: Get a customized plan to improve speed, accuracy, and rank.
// - Time Management Training: Learn to optimize your exam-taking strategy effectively.
// - Performance-Based Strategy Updates: Dynamic recommendations to keep you on track for exam success.

// With SynergiaPrep WBJEE, students get exam-ready through endless practice, intelligent feedback, and adaptive strategies—not rote learning.`,
//                 })
//               }
//             >
//               <CardContent className="p-0">
//                 <Image
//                   src="/assets/images/jee_course.jpg"
//                   alt="WBJEE Practice Platform"
//                   width={320}
//                   height={180}
//                   className="w-full h-48 object-cover rounded-t-xl"
//                 />
//                 <div className="p-6 pt-8">
//                   <h3 className="text-xl font-semibold text-gray-900">WBJEE Practice Platform</h3>
//                   <p className="text-sm text-gray-600 mt-2">Smart Practice. Smarter Strategy. Sure Success.</p>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card
//               className="transform hover:scale-105 hover:shadow-xl cursor-pointer transition-all duration-300 w-80 bg-white rounded-xl"
//               onClick={() =>
//                 handleCardClick({
//                   id: "2",
//                   title: "SynergiaPrep NEET UG Practice Platform",
//                   subtitle: "Practice. Analyze. Strategize. Succeed.",
//                   level: "Competitive",
//                   examCategories: [
//                     { id: "cat4", name: "Physics" },
//                     { id: "cat5", name: "Chemistry" },
//                     { id: "cat6", name: "Biology" },
//                   ],
//                   image: "/assets/images/neet_course.jpg",
//                   price: 0,
//                   modeOfLearning: "Online",
//                   courseContent: `SynergiaPrep’s NEET UG platform focuses on building strong fundamentals, solving thousands of questions, and using AI-driven tools to track and accelerate your preparation for India’s toughest medical entrance exam.

// Key Features:
// - Unlimited Practice Tests: Solve chapter-wise Physics, Chemistry, and Biology questions with instant feedback.
// - NEET Previous Year Papers: Get real exam insight by solving authentic PYQs.
// - Mock Tests by Experts: Simulated NEET exams prepared by experienced educators with over 15 years of success.
// - Daily Quiz Challenges: Boost your consistency with short, daily practice quizzes.
// - Brainstorming Sessions: Learn smart approaches to complex NEET-level questions.
// - AI/ML-Powered Progress Analytics: Get deep performance insights to fine-tune your preparation.
// - Personalized Study Plans: AI-generated study guidelines based on your strengths and weak points.
// - Time & Accuracy Optimization: Practice real-time strategies to maximize your NEET score.
// - Rank-Targeted Strategy Adjustments: Dynamic plans that evolve as you improve.

// With SynergiaPrep NEET UG, you gain endless practice opportunities, real-time performance tracking, and expert guidance to maximize your rank and secure a medical seat.`,
//                 })
//               }
//             >
//               <CardContent className="p-0">
//                 <Image
//                   src="/assets/images/neet_course.jpg"
//                   alt="NEET UG Practice Platform"
//                   width={320}
//                   height={180}
//                   className="w-full h-48 object-cover rounded-t-xl"
//                 />
//                 <div className="p-6 pt-8">
//                   <h3 className="text-xl font-semibold text-gray-900">NEET UG Practice Platform</h3>
//                   <p className="text-sm text-gray-600 mt-2">Practice. Analyze. Strategize. Succeed.</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Subscription Cards */}
        

//         {/* Overlay Card */}
//         {selectedCourse && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <Card className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
//               <CardHeader className="border-b border-gray-200">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl text-gray-900">{selectedCourse.title}</CardTitle>
//                   <Button variant="ghost" onClick={handleCloseOverlay} className="text-gray-600 hover:text-gray-900">
//                     ✕
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6 p-6">
//                 <div className="flex items-center space-x-6">
//                   <Image
//                     src={selectedCourse.image || "/assets/images/placeholder.jpg"}
//                     alt={selectedCourse.title}
//                     width={240}
//                     height={135}
//                     className="w-60 h-36 object-cover rounded-md"
//                   />
//                   <div className="space-y-2">
//                     <p className="text-2xl font-bold text-gray-900">${selectedCourse.price.toFixed(2)}</p>
//                     <p className="text-sm text-gray-600">Mode of Learning: {selectedCourse.modeOfLearning}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-4">
//                   <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
//                     {/* <Link href={`/courses/${selectedCourse.id}/purchase`}>Buy Now</Link> */}
//                      <Link href={`/checkout?courseId=${selectedCourse.id}`}>Buy Now</Link>
//                   </Button>
//                   <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//                     <Link href={`/courses/${selectedCourse.id}/mock-test`}>Take a Free Mock Test</Link>
//                   </Button>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Course Content</h3>
//                   <p className="text-sm text-gray-600 whitespace-pre-line">{selectedCourse.courseContent}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }




"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/* ✅ UI-only course type (NOT backend Course) */
type CourseCard = {
  id: string;
  title: string;
  subtitle: string;
  level: "BASIC" | "STANDARD" | "PREMIUM";
  examCategories: { id: string; name: string }[];
  image?: string;
  price: number;
  modeOfLearning?: string;
  courseContent?: string;
};

export default function Page() {
  const { data: session } = useSession();

  const [courses, setCourses] = useState<CourseCard[] | null>(null);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseCard | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/courses/users/${session.user.id}`);
        if (!res.ok) {
          console.error("Failed to fetch courses", res.status);
          setCourses([]);
          return;
        }
        const payload = await res.json();
        // backend might return { data: [...] } or an array directly
        const list: CourseCard[] = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.courses || [];
        setCourses(list);
      } catch (e) {
        console.error("Error fetching courses:", e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [session?.user?.id]);

  const handleCardClick = (course: CourseCard) => {
    console.log("handleCardClick", course.id, course.title);
    setSelectedCourse(course);
  };

  const handleCloseOverlay = () => {
    console.log("handleCloseOverlay");
    setSelectedCourse(null);
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-blue-400 to-gray-200 pt-6">
      <main className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black">
            Featured Courses
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {/* WBJEE */}
            <Card
              className="w-full sm:w-80 max-w-sm cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() =>
                handleCardClick({
                  id: "1",
                  title: "SynergiaPrep WBJEE Practice Platform",
                  subtitle: "Smart Practice. Smarter Strategy. Sure Success.",
                  level: "PREMIUM",
                  examCategories: [
                    { id: "cat1", name: "Physics" },
                    { id: "cat2", name: "Chemistry" },
                    { id: "cat3", name: "Mathematics" },
                  ],
                  image: "/assets/images/jee_course.jpg",
                  price: 0,
                  modeOfLearning: "Online",
                  courseContent: `AI-powered WBJEE practice platform with unlimited tests and analytics.`,
                })
              }
            >
                <CardContent className="p-0">
                <Image
                  src="/assets/images/jee_course.jpg"
                  alt="WBJEE"
                  width={320}
                  height={180}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <h3 className="font-semibold">
                    WBJEE Practice Platform
                  </h3>
                  <p className="text-sm text-gray-600">
                    Smart Practice. Smarter Strategy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User's Enrolled / Available Courses */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black">My Courses</h2>

          {loading && (
            <p className="text-sm text-gray-700">Loading your courses...</p>
          )}

          {!loading && (!courses || courses.length === 0) && (
            <p className="text-sm text-gray-700">You have no courses yet.</p>
          )}

          <div className="flex flex-wrap gap-6 justify-center">
            {courses && courses.map((c) => (
              <Card
                key={c.id}
                className="w-full sm:w-80 max-w-sm cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleCardClick(c)}
              >
                <CardContent className="p-0">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      width={320}
                      height={180}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-t-xl" />
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.subtitle}</p>
                    <p className="mt-2 text-sm font-bold">{c.price === 0 ? "Free" : `₹${c.price}`}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl mx-auto rounded-xl overflow-y-auto max-h-[90vh]">
              <CardHeader className="sticky top-0 bg-white/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-2xl">{selectedCourse.title}</CardTitle>
                  <Button variant="ghost" onClick={handleCloseOverlay} className="text-gray-600 hover:text-gray-900">
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-shrink-0 w-full sm:w-60">
                    {selectedCourse.image ? (
                      <Image
                        src={selectedCourse.image}
                        alt={selectedCourse.title}
                        width={240}
                        height={135}
                        className="w-full h-40 sm:h-36 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 rounded-md" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold">{selectedCourse.price === 0 ? "Free" : `₹${selectedCourse.price}`}</p>
                    <p className="text-sm text-gray-600">Mode of Learning: {selectedCourse.modeOfLearning}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Course Content</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedCourse.courseContent}</p>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href={`/checkout?courseId=${selectedCourse.id}`}>Buy Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Link href={`/courses/${selectedCourse.id}/mock-test`}>Take a Free Mock Test</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
    </div>
  );
}
