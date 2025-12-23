
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import CourseCard from "@/components/course-card";
import { Separator } from "@/components/ui/separator";
import FAQ from "@/components/Faq";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Types
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
      ))}
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }

        const jsonData = await response.json();
        setData(jsonData.courses);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Reusable components
const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="min-h-screen w-full m-0 p-0 bg-gradient-to-b from-[#0f3bfe] via-blue-400 dark:via-blue-900 to-blue-500 pt-20">
    {children}
  </div>
);

const SkeletonCard = () => (
  <div className="min-w-[300px] max-w-[350px] h-[500px] bg-gray-200 rounded-lg shadow-md">
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
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-row flex-wrap gap-5 justify-center">
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
    <Separator className="my-4" />
    <FAQ />
  </PageLayout>
);

const CourseGrid = ({ courses }: { courses: Course[] }) => (
  <div className="py-12">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center text-white mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Abroad</h1>
      <p className="text-lg md:text-xl">Explore global education opportunities</p>
    </motion.div>
    <div className="max-w-7xl mx-auto px-4 flex flex-row flex-wrap gap-5 justify-center">
      {courses.map((course, index) => (
        <motion.div
          key={course.courseId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="min-w-[300px] max-w-[350px] h-[500px]"
        >
          <CourseCard
            className="h-full flex flex-col bg-white/10 backdrop-blur-sm border-none text-white"
            course={{
              id: course.courseId ?? "",
              thumbnailUrl: course.banner ?? "/assets/images/placeholder.jpg",
              title: course.title ?? "Untitled Course",
              subtitle: course.summary ?? "",
              description: course.objective ?? "",
              instructor: course.coordinator ?? "Unknown Instructor",
              rating: 0,
              reviewCount: 0,
              enrollmentCount: 0,
              price: 0,
              discount: 0,
              bestseller: false,
              level: (((): "BASIC" | "STANDARD" | "PREMIUM" => {
                const l = (course.level ?? "").toUpperCase();
                return l === "BASIC" || l === "STANDARD" || l === "PREMIUM"
                  ? (l as "BASIC" | "STANDARD" | "PREMIUM")
                  : "BASIC";
              })()),
              examCategories: [],
              exams: [],
            }}
            onOpenPreview={() => alert(`Preview for ${course.title ?? "course"}`)}
          />
        </motion.div>
      ))}
    </div>
  </div>
);

// Main Page component
export default function Page() {
  const { data: courses, loading, error } = useData<Course[]>("/api/study-abroad/all");

  if (loading) {
    return <LoadingSkeleton />;
  }

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
