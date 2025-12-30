"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Search,
  Filter,
  List,
  Grid,
  Info,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface practiceTest {
  id: string;
  title: string;
  subjects: { name: string; chapters: { name: string }[] }[];
  exam: "NEET" | "JEE" | "WBJEE";
  totalDurationInSeconds: number;
  totalQuestions: number;
  totalMarks: number;
}

const Page: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [practiceTests, setpracticeTests] = useState<practiceTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchpracticeTests = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/exams?type=PRACTICE");
        const data = await response.json();
        setpracticeTests(data.data as practiceTest[]);
      } catch (e) {
        console.error("Error fetching Practice Tests:", e);
        setError("Failed to load Practice Tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchpracticeTests();
  }, []);

  // Handle test start - check if user is logged in
  const handleStartTest = (testId: string) => {
    if (status === "authenticated") {
      // User is logged in, proceed to test
      router.push(`/exam?examId=${testId}`);
    } else {
      // User is not logged in, redirect to login with callback
      const callbackUrl = `/exam?examId=${testId}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  };

  // Extract unique subjects from available tests
  const uniqueSubjects = useMemo(() => {
    if (!practiceTests || !Array.isArray(practiceTests)) return [];
    const subjects = practiceTests.flatMap((test) =>
      test.subjects.map((subject) => subject.name)
    );
    return [...new Set(subjects)];
  }, [practiceTests]);

  // Get available exams
  const availableExams = useMemo(() => {
    if (!practiceTests || !Array.isArray(practiceTests)) return [];
    return [...new Set(practiceTests.map((test) => test.exam))];
  }, [practiceTests]);

  // Filter tests based on selected filters
  const filteredExams = useMemo(() => {
    if (!practiceTests || !Array.isArray(practiceTests)) return [];
    return practiceTests.filter(
      (test) =>
        (!selectedExam || test.exam === selectedExam) &&
        (!selectedSubject ||
          test.subjects.some((subject) => subject.name === selectedSubject)) &&
        (searchQuery === "" ||
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.subjects.some((subject) =>
            subject.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );
  }, [practiceTests, selectedExam, selectedSubject, searchQuery]);

  const resetFilters = () => {
    setSelectedExam(null);
    setSelectedSubject(null);
    setSearchQuery("");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} mins`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16 text-center mb-8 rounded-lg shadow-sm border">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Practice Tests
          </h1>
          <p className="text-xl text-gray-600">Loading practice tests...</p>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 py-16 text-center mb-8 rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold mb-4 text-rose-700">Oops!</h1>
          <p className="text-xl text-rose-600">{error}</p>
          <Button
            className="mt-4 bg-rose-600 hover:bg-rose-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const renderTestCard = (test: practiceTest) => {
    const totalChapters = test.subjects.flatMap((s) => s.chapters).length;
    const isLoggedIn = status === "authenticated";

    return (
      <div key={test.id} className="h-full">
        <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-blue-200 bg-white flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                {test.title}
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {test.exam}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-grow">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDuration(test.totalDurationInSeconds)}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <Target className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-700">
                  {test.totalQuestions} Questions
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-700">
                  {test.subjects.length} Subjects
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-gray-600 mb-1" />
                <span className="text-sm font-medium text-gray-700">
                  {test.totalMarks} Marks
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Topics Covered:{" "}
                  <span className="font-normal text-gray-500">
                    {totalChapters} topics
                  </span>
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
                    >
                      <Info className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-80 overflow-y-auto p-4">
                    <div className="font-medium mb-2 text-gray-900">
                      Subjects & Topics
                    </div>
                    {test.subjects.map((subject) => (
                      <div key={subject.name} className="mb-3">
                        <p className="text-sm font-semibold mb-1 text-gray-700">
                          {subject.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {subject.chapters.map((chapter, index) => (
                            <Badge
                              key={`${chapter.name}-${index}`}
                              variant="secondary"
                              className="text-xs mb-1 bg-gray-100 text-gray-700"
                            >
                              {chapter.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-wrap gap-1">
                {test.subjects.map((subject) => (
                  <Badge
                    key={subject.name}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700"
                  >
                    {subject.name}
                  </Badge>
                ))}
              </div>
            </div>

            {!isLoggedIn && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mb-2">
                <Lock className="h-4 w-4" />
                <span>Login required to start test</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              onClick={() => handleStartTest(test.id)}
              className={`w-full ${isLoggedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"}`}
            >
              {isLoggedIn ? "Start Test" : "Login to Start"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderTestRow = (test: practiceTest) => {
    const totalChapters = test.subjects.flatMap((s) => s.chapters).length;
    const isLoggedIn = status === "authenticated";

    return (
      <div key={test.id}>
        <Card className="hover:shadow-lg transition-all duration-300 border hover:border-blue-200 bg-white mb-3">
          <div className="flex flex-col md:flex-row p-4">
            <div className="flex-grow md:pr-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {test.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {test.exam}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {test.subjects.map((subject) => (
                    <Badge
                      key={subject.name}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {formatDuration(test.totalDurationInSeconds)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {test.totalQuestions} Questions
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {test.subjects.length} Subjects
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {test.totalMarks} Marks
                  </span>
                </div>
              </div>

              <div className="flex items-center my-2">
                <p className="text-sm font-medium text-gray-700 mr-2">
                  Topics Covered: {totalChapters}
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:bg-gray-200"
                    >
                      <Info className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-80 overflow-y-auto p-4">
                    <div className="font-medium mb-2 text-gray-900">
                      Subjects & Topics
                    </div>
                    {test.subjects.map((subject) => (
                      <div key={subject.name} className="mb-3">
                        <p className="text-sm font-semibold mb-1 text-gray-700">
                          {subject.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {subject.chapters.map((chapter, index) => (
                            <Badge
                              key={`${chapter.name}-${index}`}
                              variant="secondary"
                              className="text-xs mb-1 bg-gray-100 text-gray-700"
                            >
                              {chapter.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {!isLoggedIn && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                  <Lock className="h-4 w-4" />
                  <span>Login required to start this test</span>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 md:flex md:items-center">
              <Button
                onClick={() => handleStartTest(test.id)}
                className={`${isLoggedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"}`}
              >
                {isLoggedIn ? "Start Test" : "Login to Start"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 py-12 text-center mb-8 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Practice Tests
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Browse and explore practice tests. Login to attempt tests and track
          your progress.
        </p>
        {status !== "authenticated" && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Login to Attempt Tests
            </Button>
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Create Free Account
            </Button>
          </div>
        )}
      </div>

      <div className="shadow-sm rounded-lg p-6 bg-white border mb-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center w-full md:w-auto max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tests by title or subject"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={selectedExam || "all-exams"}
                onValueChange={(value) => {
                  setSelectedExam(value === "all-exams" ? null : value);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Exams</SelectLabel>
                    <SelectItem value="all-exams">All Exams</SelectItem>
                    {availableExams.map((exam, idx) => (
                      <SelectItem key={idx} value={exam}>
                        {exam}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={selectedSubject || "all-subjects"}
                onValueChange={(value) =>
                  setSelectedSubject(value === "all-subjects" ? null : value)
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>
                    <SelectItem value="all-subjects">All Subjects</SelectItem>
                    {uniqueSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex items-center border-gray-300"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>

              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none border-r"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedExam && (
              <Badge
                variant="secondary"
                className="flex gap-1 items-center bg-blue-100 text-blue-700"
              >
                Exam: {selectedExam}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                  onClick={() => setSelectedExam(null)}
                >
                  <span className="sr-only">Remove</span>×
                </Button>
              </Badge>
            )}

            {selectedSubject && (
              <Badge
                variant="secondary"
                className="flex gap-1 items-center bg-green-100 text-green-700"
              >
                Subject: {selectedSubject}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:bg-green-200"
                  onClick={() => setSelectedSubject(null)}
                >
                  <span className="sr-only">Remove</span>×
                </Button>
              </Badge>
            )}

            {searchQuery && (
              <Badge
                variant="secondary"
                className="flex gap-1 items-center bg-gray-100 text-gray-700"
              >
                Search: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="sr-only">Remove</span>×
                </Button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map(renderTestCard)}
        </div>
      ) : (
        <div className="space-y-2">{filteredExams.map(renderTestRow)}</div>
      )}

      {filteredExams.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-2">
            No Practice Tests found matching your filters
          </p>
          <Button onClick={resetFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
