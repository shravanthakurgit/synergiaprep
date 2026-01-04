"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/course-card";
import { Separator } from "@/components/ui/separator";
import FAQ from "@/components/Faq";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

/* ================= TYPES ================= */

interface Course {
  courseId: string;
  banner: string;
  title: string;
  summary: string;
  skills: string[];
  objective: string;
  outcome: string;
  coordinator: string;
  duration: string;
  startDate: string;
  level: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
}

/* ================= DEMO DATA ================= */

const DEMO_COURSES: Course[] = [
  {
    courseId: "study-abroad-101",
    banner:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070",
    title: "Study Abroad Application Masterclass",
    summary:
      "Comprehensive guide to successful international university applications",
    skills: [
      "Application Strategy",
      "SOP Writing",
      "Interview Preparation",
      "Visa Process",
    ],
    objective:
      "Equip students with skills to craft winning applications for top global universities",
    outcome:
      "Students will complete 3-5 polished applications with compelling personal statements",
    coordinator: "Dr. Sarah Chen",
    duration: "8 weeks",
    startDate: "2024-03-15",
    level: "PREMIUM",
  },
  {
    courseId: "mba-international",
    banner:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070",
    title: "Global MBA Admissions",
    summary: "Strategic preparation for top business schools worldwide",
    skills: [
      "GMAT/GRE Prep",
      "Leadership Essays",
      "Networking",
      "Case Interviews",
    ],
    objective: "Secure admission to top 50 global MBA programs",
    outcome: "Complete application package for 5 target schools",
    coordinator: "Dr. Michael Rodriguez",
    duration: "12 weeks",
    startDate: "2024-03-20",
    level: "STANDARD",
  },
];

/* ================= DATA HOOK ================= */

const useData = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // For demo purposes, use mock data
        // Comment out the fetch and uncomment below for real API
        // const response = await fetch(url, { cache: "no-store" });
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch data from ${url}`);
        // }
        // const jsonData = await response.json();
        // setData(jsonData.courses);

        // Using demo data
        setTimeout(() => {
          setData(DEMO_COURSES as T);
        }, 800); // Simulate loading delay
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

/* ================= LAYOUT ================= */

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="min-h-screen w-full bg-gradient-to-b from-[#0f3bfe] via-blue-400 dark:via-blue-900 to-blue-500 pt-20">
    {children}
  </div>
);

/* ================= SKELETONS ================= */

const SkeletonCard = () => (
  <div className="w-full max-w-[350px] h-[500px] bg-gray-200 rounded-lg shadow-md">
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <div className="p-4">
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <PageLayout>
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-wrap gap-5 justify-center">
      {[...Array(2)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
    <Separator className="my-4" />
    <FAQ />
  </PageLayout>
);

/* ================= COURSE GRID ================= */

const CourseGrid = ({ courses }: { courses: Course[] }) => {
  const router = useRouter();

  const handlePreview = (courseId: string) => {
    router.push(`/study-abroad/${courseId}`);
  };

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-white mb-8 px-4"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Certificate Course
        </h1>
        <p className="text-base sm:text-lg md:text-xl">
          Explore global education opportunities
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-5 justify-center">
        {courses.map((course, index) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="w-full max-w-[350px] h-[500px]"
          >
            <CourseCard
              className="h-[86%] flex flex-col bg-white/20 backdrop-blur-md border border-white/20 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-white"
              course={{
                id: course.courseId,
                thumbnailUrl: course.banner || "/assets/images/placeholder.jpg",
                title: course.title || "Untitled Course",
                subtitle: course.summary || "",
                description: course.objective || "",
                instructor: course.coordinator || "Unknown Instructor",
                rating: 4.7,
                reviewCount: 89,
                enrollmentCount: 1250,
                price: course.level === "PREMIUM" ? 699 : 499,
                discount: course.level === "PREMIUM" ? 100 : 50,
                bestseller: course.level === "PREMIUM",
                level: (() => {
                  const l = course.level?.toUpperCase();
                  return l === "BASIC" || l === "STANDARD" || l === "PREMIUM"
                    ? l
                    : "BASIC";
                })(),
                examCategories: [],
                exams: [],
              }}
              onOpenPreview={() => handlePreview(course.courseId)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ================= PAGE ================= */

export default function Page() {
  const {
    data: courses,
    loading,
    error,
  } = useData<Course[]>("/api/study-abroad/all");

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <PageLayout>
        <div className="text-center p-4 text-red-500">Error: {error}</div>
        <Separator className="my-4" />
        <FAQ />
      </PageLayout>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <PageLayout>
        <div className="text-center p-4 text-white">No courses available</div>
        <Separator className="my-4" />
        <FAQ />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CourseGrid courses={courses} />
      <Separator className="my-4" />
      <FAQ />
    </PageLayout>
  );
}
