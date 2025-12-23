"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/type/course";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [studyHours, setStudyHours] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`/api/v1/courses/users/${userid}`);
        const data = await response.json();
        setCourses(data.data);
        // console.log("User ID:", session?.user.id);
        // console.log("Fetched courses:", data);
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    }

    const userid = session?.user.id;
    if (!userid) {
      console.log("User ID is not available.");
      return;
    }
    fetchCourses();

    async function fetchStudyHours() {
      try {
        const resp = await fetch(`/api/v1/users/${userid}/study-hours`);
        const j = await resp.json();
        if (typeof j?.hours === "number") setStudyHours(j.hours);
      } catch (err) {
        console.error("Error fetching study hours:", err);
      }
    }

    fetchStudyHours();
  }, [session?.user.id]);

  const completedCourses = courses ? courses.length : null;
  const availableMockTests = courses
    ? courses.reduce((acc, c) => acc + (c.exams?.length ?? 0), 0)
    : null;

  const learningStats = [
    {
      title: "Completed Courses",
      value: completedCourses !== null ? String(completedCourses) : "—",
      change: "",
    },
    {
      title: "Study Hours Logged",
      value:
        studyHours !== null ? `${studyHours} hours` : "Loading...",
      change: "",
    },
    {
      title: "Mock Tests Available",
      value:
        availableMockTests !== null ? String(availableMockTests) : "—",
      change: "",
    },
  ];


  return (
    <div className="flex-1 ">
      <main className="p-6 space-y-6">
        {/* Learning Stats Row */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
          <div className="flex flex-wrap gap-4">
            {learningStats.map((stat) => (
              <Card key={stat.title} className="flex-1 min-w-[200px]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Cards */}
        <div>
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Your Subscriptions</h2>
            <Link href="/subscribe">
              <Button variant={"link"} className="text-sm text-blue-500">
                View Other Courses
              </Button>
            </Link>
          </div>

          {!courses && <Skeleton className="h-96 w-auto mb-4" />}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
            {courses &&
              courses.map((course, idx) => (
                <Card
                  key={idx}
                  className="transform hover:scale-105 hover:shadow-2xl cursor-pointer transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          <span>{course.title}</span>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <span className="font-medium">{course.subtitle}</span>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Level:
                        </span>
                        <span>{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Exam Categories:
                        </span>
                        <span>
                          {course.examCategories.map((category) => (
                            <Badge key={category.id} className="mr-1">
                              {category.name}
                            </Badge>
                          ))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {courses && courses.length === 0 && (
              <div className="col-span-3 text-center p-4 border rounded-md text-muted-foreground">
                No subscriptions found. Please check back later.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
