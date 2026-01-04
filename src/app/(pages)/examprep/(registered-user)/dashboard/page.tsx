"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { data: session } = useSession();

  const [studyHours, setStudyHours] = useState<number | null>(null);
  const [totalExams, setTotalExams] = useState<number | null>(null);
  const [totalAttempts, setTotalAttempts] = useState<number | null>(null);

  useEffect(() => {
  const userid = session?.user.id;
  if (!userid) return;

  async function fetchAllStats() {
    const results = await Promise.allSettled([
      fetch(`/api/v1/users/${userid}/exam-attempt`)
        .then((r) => r.json()),
      fetch(`/api/v1/users/${userid}/total-exams`)
        .then((r) => r.json()),
      fetch(`/api/v1/users/${userid}/study-hours`)
        .then((r) => r.json()),
    ]);

    // Exam Attempts
    if (results[0].status === "fulfilled") {
      setTotalAttempts(results[0].value.totalAttempts);
    } else {
      console.error("Exam attempts failed", results[0].reason);
    }

    // Total Exams
    if (results[1].status === "fulfilled") {
      setTotalExams(results[1].value.totalExams);
    } else {
      console.error("Total exams failed", results[1].reason);
    }

    // Study Hours
    if (results[2].status === "fulfilled") {
      if (typeof results[2].value?.hours === "number") {
        setStudyHours(results[2].value.hours);
      }
    } else {
      console.error("Study hours failed", results[2].reason);
    }
  }

  fetchAllStats();
}, [session?.user.id]);

  const learningStats = [
    {
      title: "Total Exams",
      value: totalExams !== null ? `${totalExams || 0} exams` : "Loading...",
    },
    {
      title: "Exams Attempted",
      value: totalAttempts !== null ? `${totalAttempts || 0} attempts` : "Loading...",
    },
    {
      title: "Study Hours Logged",
      value: studyHours !== null ? `${(studyHours / 60).toFixed(2)} hours` : "Loading...",
    },
  ];

  return (
    <div className="flex-1">
      <main className="p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>

          <div className="flex flex-wrap gap-4">
            {learningStats.map((stat) => (
              <Card key={stat.title} className="flex-1 min-w-[200px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value ?? <Skeleton className="h-6 w-20" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
