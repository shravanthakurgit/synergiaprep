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
  ChevronDown,
  Info,
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
import Link from "next/link";
import DeleteExamButton from "@/components/DeleteExamButton";

interface brainstormTest {
  id: string;
  title: string;
  subjects: { name: string; chapters: { name: string }[] }[];
  exam: "NEET" | "JEE" | "WBJEE";
  totalDurationInSeconds: number;
  totalQuestions: number;
  totalMarks: number;
}

interface UserSubscription {
  activeExams: ("NEET" | "JEE" | "WBJEE")[];
}

// Sample user subscription - In real app, this would come from your backend
const userSubscription: UserSubscription = {
  activeExams: ["NEET", "JEE", "WBJEE"],
};

const Page: React.FC = () => {
  const [brainstormTests, setbrainstormTests] = useState<brainstormTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchbrainstormTests = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/exams?type=brainstorm");
        const data = await response.json();
        setbrainstormTests(data.data as brainstormTest[]);
      } catch (e) {
        console.error("Error fetching brainstorm tests:", e);
        setError("Failed to load brainstorm tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchbrainstormTests();
  }, []);

  // Extract unique subjects from available tests
  const uniqueSubjects = useMemo(() => {
    if (!brainstormTests || !Array.isArray(brainstormTests)) return [];
    const subjects = brainstormTests.flatMap((test) =>
      test.subjects.map((subject) => subject.name)
    );
    return [...new Set(subjects)];
  }, [brainstormTests]);

  // Get available exams
  const availableExams = useMemo(() => {
    if (!brainstormTests || !Array.isArray(brainstormTests)) return [];
    return [...new Set(brainstormTests.map((test) => test.exam))];
  }, [brainstormTests]);

  // Filter tests based on selected filters
  const filteredExams = useMemo(() => {
    if (!brainstormTests || !Array.isArray(brainstormTests)) return [];
    return brainstormTests.filter(
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
  }, [brainstormTests, selectedExam, selectedSubject, searchQuery]);

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
        <div className="bg-accent py-16 text-center mb-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">brainstorm Tests</h1>
          <p className="text-xl">
            Loading your personalized brainstorm experience...
          </p>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-r from-rose-400 to-amber-400 text-white py-16 text-center mb-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <p className="text-xl">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const renderTestCard = (test: brainstormTest) => {
    const totalChapters = test.subjects.flatMap((s) => s.chapters).length;

    return (
      <div key={test.id} className="h-full">
        <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary bg-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold line-clamp-2">
              {test.title}
            </CardTitle>
            <Badge variant="outline" className="w-fit">
              {test.exam}
            </Badge>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Clock className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-1" />
                <span className="text-sm font-medium">
                  {formatDuration(test.totalDurationInSeconds)}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Target className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-1" />
                <span className="text-sm font-medium">
                  {test.totalQuestions} Questions
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-1" />
                <span className="text-sm font-medium">
                  {test.subjects.length} Subjects
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Award className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-1" />
                <span className="text-sm font-medium">
                  {test.totalMarks} Marks
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  Topics Covered:{" "}
                  <span className="font-normal text-slate-500">
                    {totalChapters} topics
                  </span>
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-80 overflow-y-auto p-4">
                    <div className="font-medium mb-2">Subjects & Topics</div>
                    {test.subjects.map((subject) => (
                      <div key={subject.name} className="mb-3">
                        <p className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
                          {subject.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {subject.chapters.map((chapter, index) => (
                            <Badge
                              key={`${chapter.name}-${index}`}
                              variant="secondary"
                              className="text-xs mb-1"
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

              <div className="flex flex-wrap gap-1 mt-2">
                {test.subjects.map((subject) => (
                  <Badge
                    key={subject.name}
                    variant="secondary"
                    className="text-xs"
                  >
                    {subject.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex flex-col gap-2 mt-4">
            <Link href={`/exam?examId=${test.id}`} className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Test</Button>
            </Link>
            <DeleteExamButton
              examId={test.id}
              onDeleted={() => {
                setbrainstormTests((prev) =>
                  prev.filter((exam) => exam.id !== test.id)
                );
              }}
              />
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderTestRow = (test: brainstormTest) => {
    const totalChapters = test.subjects.flatMap((s) => s.chapters).length;

    return (
      <div key={test.id}>
        <Card className="hover:shadow-lg transition-all duration-300 border hover:border-primary bg-card mb-3">
          <div className="flex flex-col md:flex-row p-4">
            <div className="flex-grow md:pr-4">
              <div>
                <h3 className="text-lg font-bold mb-1">{test.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{test.exam}</Badge>
                  {test.subjects.map((subject) => (
                    <Badge key={subject.name} variant="secondary">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2" />
                  <span className="text-sm">
                    {formatDuration(test.totalDurationInSeconds)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2" />
                  <span className="text-sm">
                    {test.totalQuestions} Questions
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2" />
                  <span className="text-sm">
                    {test.subjects.length} Subjects
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-slate-600 dark:text-slate-300 mr-2" />
                  <span className="text-sm">{test.totalMarks} Marks</span>
                </div>
              </div>

              <div className="flex items-center my-2">
                <p className="text-sm font-medium mr-2">
                  Topics Covered: {totalChapters}
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-80 overflow-y-auto p-4">
                    <div className="font-medium mb-2">Subjects & Topics</div>
                    {test.subjects.map((subject) => (
                      <div key={subject.name} className="mb-3">
                        <p className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
                          {subject.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {subject.chapters.map((chapter, index) => (
                            <Badge
                              key={`${chapter.name}-${index}`}
                              variant="secondary"
                              className="text-xs mb-1"
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
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 md:flex md:items-center">
              <Link href={`/exam?examId=${test.id}`}>
                <Button>Start Test</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-accent py-16 text-center mb-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">brainstorm Tests</h1>
        <p className="text-xl">
          Master your skills with targeted brainstorm exams
        </p>
      </div>

      <div className="shadow-md rounded-lg p-6 bg-card mb-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center w-full md:w-auto max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                className="flex items-center"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
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
              <Badge variant="secondary" className="flex gap-1 items-center">
                Exam: {selectedExam}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSelectedExam(null)}
                >
                  <span className="sr-only">Remove</span>×
                </Button>
              </Badge>
            )}

            {selectedSubject && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                Subject: {selectedSubject}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSelectedSubject(null)}
                >
                  <span className="sr-only">Remove</span>×
                </Button>
              </Badge>
            )}

            {searchQuery && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                Search: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
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
        <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <TrendingUp className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            No brainstorm tests found matching your filters
          </p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Page;
