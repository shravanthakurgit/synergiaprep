"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import DemoPage from "./demopage/page"; // Import the DemoPage component

interface ExamCategories {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  cutoffs: string;
  examPattern: string;
}

const ExamPrepPage = () => {
  const { data: session,status } = useSession();
  const [hasSubscription, setHasSubscription] = useState(true);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<ExamCategories[]>([]);
  

  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const fetchExamCatergories = async () => {
      try {
        const response = await fetch("api/v1/exam-categories");
        const result = await response.json();
        setExams(result.data || []);
      } catch (error) {
        console.error("Failed to fetch exam categories:", error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamCatergories();
  }, []);

  // Subscription check
//  useEffect(() => {
//   if (status === "loading") return;

//   const isSubscribed =
//     (session?.user?.enrollments?.length ?? 0) > 0;

//   setHasSubscription(isSubscribed);
//   setLoading(false);
// }, [status, session]);

  // If NOT logged in, show DemoPage directly
  if (!isLoggedIn) {
    return <DemoPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#2D9596] to-[#88C399] flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Only logged in users see the original page
  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/images/examprepbackground.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9596] to-[#88C399] opacity-90" />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex items-center space-x-2 bg-white/20 p-2 w-content rounded-full mx-auto mb-4">
          <Switch
            id="subscription"
            checked={hasSubscription}
            // onCheckedChange={(checked) => setHasSubscription(checked)}
            className="bg-white/20 z-11"
          />
          <Label htmlFor="subscription">is Subscribed?</Label>
          {session &&
            session.user &&
            session.user.role.toUpperCase() === "ADMIN" && (
              <div className="ml-auto">
                <Link href="/admin">
                  <Button
                    size="sm"
                    className="bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300"
                  >
                    Admin Panel
                  </Button>
                </Link>
              </div>
            )}
          {session &&
            session.user &&
            session.user.role.toUpperCase() === "SUPERADMIN" || session.user.role.toUpperCase() === "ADMIN" &&(
              <div className="ml-auto">
                <Link href="/superadmin">
                  <Button
                    size="sm"
                    className="bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300"
                  >
                    Super Admin Panel
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    size="sm"
                    className="bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300"
                  >
                    Admin Panel
                  </Button>
                </Link>
              </div>
            )}
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Exam Prep
          </h1>
          <p className="text-xl text-white/90">
            Your gateway to success in competitive examinations
          </p>
        </div>

        {hasSubscription ? (
          <div className="p-8 shadow-xl text-center bg-white/20 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back!
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/examprep/dashboard">
                <Button
                  size="lg"
                  className="bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 shadow-xl bg-white/20 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold mb-0 text-gray-800">
                Available Exam Preparations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams && exams.length > 0 ? (
                exams.map((exam) => (
                  <Card
                    key={exam.id}
                    className="group hover:shadow-xl transition-all duration-300 bg-white/05 rounded-xl flex flex-col justify-between"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {exam.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {exam.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="font-semibold">Eligibility:</span>{" "}
                          {exam.eligibility}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Cut-offs:</span>{" "}
                          {exam.cutoffs}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Exam Pattern:</span>{" "}
                          {exam.examPattern}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/subscribe`} className="w-full pr-2">
                        <Button className="w-full bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300">
                          Subscribe
                        </Button>
                      </Link>
                      <Link
                        href={`/examprep/${exam.name.toLowerCase()}`}
                        className="w-full"
                      >
                        <Button className="w-full bg-[#2D9596] hover:bg-[#88C399] transition-colors duration-300">
                          Start Preparation
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-800">
                  No exam categories available at the moment.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPrepPage;
