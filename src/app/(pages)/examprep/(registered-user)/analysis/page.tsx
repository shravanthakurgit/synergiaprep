"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  ChevronRight,
  BookOpen,
  Trophy,
  BarChart as BarChartIcon,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

// Types (same as before)
interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  createdAt: string;
  updatedAt: string;
  exam: {
    id: string;
    title: string;
  };
}

interface OverallPerformance {
  rank: number;
  score: number;
  accuracy: number;
  percentile: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  maxMarks?: number;
}

interface TopicPerformance {
  topic: string;
  accuracy: number;
  questions: number;
  correct: number;
}

interface DifficultyPerformance {
  difficulty: string;
  accuracy: number;
  questions: number;
  correct: number;
}

interface TimeManagement {
  totalTimeTaken: number;
  averageTimePerQuestion: number;
  timePerSection?: {
    section: string;
    timeTaken: number;
  }[];
}

interface StrengthsAndWeaknesses {
  strengths: string[];
  weaknesses: string[];
}

interface DifficultyTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

interface RenderTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

// Change this line in the ReportData interface:
interface ReportData {
  id: string;
  examAttemptId: string;
  overallPerformance: OverallPerformance;
  topicWisePerformance: TopicPerformance[];
  difficultyWisePerformance: DifficultyPerformance[];
  timeManagement: TimeManagement;
  strengthsAndWeaknesses: StrengthsAndWeaknesses;
  suggestedImprovements: string[]; // Changed from any[] to string[]
  createdAt: string;
  updatedAt: string;
}

interface OverallStats {
  totalAttempts: number;
  avg_score: number;
  avg_attempted_questions: number;
  avg_accuracy: number;
}

// Add this interface at the top of the file (with other interfaces)
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }>;
  label?: string;
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const TestAnalysisDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<ExamAttempt[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ExamAttempt | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalAttempts: 0,
    avg_score: 0,
    avg_attempted_questions: 0,
    avg_accuracy: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const fetchSubmissions = useCallback(async (userId: string) => {
    try {
      setError(null);
      const url = new URL("/api/v1/user-submissions", window.location.href);
      url.searchParams.set("user-id", userId);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }

      const data = await response.json();

      // Reverse the array to show newest first
      const reversedSubmissions = data.data ? [...data.data].reverse() : [];

      setSubmissions(reversedSubmissions);

      if (reversedSubmissions.length > 0) {
        setSelectedSubmission(reversedSubmissions[0]);
        fetchReportData(
          reversedSubmissions[0].id,
          reversedSubmissions[0].examId,
          reversedSubmissions[0].userId
        );
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions. Please try again.");
    }
  }, []);

  // Then add fetchSubmissions to the dependency array
  useEffect(() => {
    const userId = session?.user?.id;
    if (userId) {
      fetchSubmissions(userId);
      fetchOverallStats(userId);
    }
  }, [session?.user?.id, fetchSubmissions]); // Add fetchSubmissions here

  const fetchOverallStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/v1/reports/users/${userId}`, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setOverallStats(
        data.data || {
          totalAttempts: 0,
          avg_score: 0,
          avg_attempted_questions: 0,
          avg_accuracy: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching overall stats:", error);
    }
  };

  useEffect(() => {
    const userId = session?.user?.id;
    if (userId) {
      fetchSubmissions(userId);
      fetchOverallStats(userId);
    }
  }, [session?.user?.id]);

  const fetchReportData = async (
    userSubmissionId: string,
    examId: string,
    userId: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(
        `/api/v1/reports/exams/${examId}/users/${userId}`,
        window.location.origin
      );
      url.searchParams.set("user-submission-id", userSubmissionId);

      const response = await fetch(url, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.data || result.data.length === 0) {
        throw new Error("No report data found");
      }

      const report = result.data[0];

      let suggestedImprovements = report.suggestedImprovements || [];
      if (typeof suggestedImprovements === "string") {
        try {
          suggestedImprovements = JSON.parse(suggestedImprovements);
        } catch (error) {
          console.warn("Failed to parse suggestedImprovements:", error);
          suggestedImprovements = [];
        }
      }

      const overallPerformance = {
        ...report.overallPerformance,
        totalQuestions: report.overallPerformance.totalQuestions || 0,
        attemptedQuestions: report.overallPerformance.attemptedQuestions || 0,
        correctAnswers: report.overallPerformance.correctAnswers || 0,
        accuracy: report.overallPerformance.accuracy || 0,
      };

      const cleanedReport = {
        ...report,
        overallPerformance,
        suggestedImprovements: Array.isArray(suggestedImprovements)
          ? suggestedImprovements
          : [],
        timeManagement: {
          ...report.timeManagement,
          totalTimeTaken: (report.timeManagement?.totalTimeTaken || 0) / 60,
          averageTimePerQuestion:
            (report.timeManagement?.averageTimePerQuestion || 0) / 60,
        },
      };

      setReportData(cleanedReport);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load report"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionClick = (submission: ExamAttempt) => {
    setSelectedSubmission(submission);
    fetchReportData(submission.id, submission.examId, submission.userId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const COLORS = [
    "#10B981",
    "#EF4444",
    "#6366F1",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];

  const formatTime = (minutes: number): string => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const renderPerformanceDonut = () => {
    if (!reportData) return null;

    const totalQuestions = reportData.overallPerformance.totalQuestions || 0;
    const correctAnswers = reportData.overallPerformance.correctAnswers || 0;
    const attemptedQuestions =
      reportData.overallPerformance.attemptedQuestions || 0;

    const incorrect = Math.max(0, attemptedQuestions - correctAnswers);
    const unattempted = Math.max(0, totalQuestions - attemptedQuestions);
    const actualCorrect = correctAnswers;

    const displayTotal =
      totalQuestions > 0 ? totalQuestions : attemptedQuestions;

    const performanceData = [];

    if (actualCorrect > 0) {
      performanceData.push({
        name: "Correct",
        value: actualCorrect,
        color: "#10B981",
      });
    }

    if (incorrect > 0) {
      performanceData.push({
        name: "Incorrect",
        value: incorrect,
        color: "#EF4444",
      });
    }

    if (unattempted > 0) {
      performanceData.push({
        name: "Unattempted",
        value: unattempted,
        color: "#9CA3AF",
      });
    }

    if (performanceData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No performance data available
        </div>
      );
    }

    // Then update the CustomTooltip function
    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold">{data.name}</p>
            <p className="text-gray-700">
              {data.value} questions
              {displayTotal > 0 && (
                <> ({((data.value / displayTotal) * 100).toFixed(1)}%)</>
              )}
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 70 : 90}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
            >
              {performanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: isMobile ? "10px" : "20px",
                fontSize: isMobile ? "11px" : "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Quick Stats - Responsive */}
        <div
          className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-2 mt-4`}
        >
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-xs font-medium">Correct</div>
            <div className={`${isMobile ? "text-base" : "text-lg"} font-bold`}>
              {actualCorrect}
            </div>
          </div>
          <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
            <div className="text-xs font-medium">Incorrect</div>
            <div className={`${isMobile ? "text-base" : "text-lg"} font-bold`}>
              {incorrect}
            </div>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-xs font-medium">Attempted</div>
            <div className={`${isMobile ? "text-base" : "text-lg"} font-bold`}>
              {attemptedQuestions}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-xs font-medium">Total</div>
            <div className={`${isMobile ? "text-base" : "text-lg"} font-bold`}>
              {displayTotal > 0 ? displayTotal : attemptedQuestions}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTopicPerformance = () => {
    if (
      !reportData?.topicWisePerformance ||
      reportData.topicWisePerformance.length === 0
    ) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No topic performance data available
        </div>
      );
    }

    const displayTopics = reportData.topicWisePerformance.slice(
      0,
      isMobile ? 4 : 6
    );
    const sortedTopics = [...displayTopics].sort(
      (a, b) => b.accuracy - a.accuracy
    );

    // Update the renderTick function
    const renderTick = (props: RenderTickProps) => {
      const { x, y, payload } = props;
      const topic: string = payload.value;

      let displayText = topic;
      if (topic.length > (isMobile ? 8 : 15)) {
        displayText = topic
          .split(" ")
          .map((word: string) => word.charAt(0))
          .join("")
          .toUpperCase();
      } else if (topic.length > (isMobile ? 6 : 10)) {
        displayText = topic.substring(0, isMobile ? 6 : 10) + "...";
      }

      return (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          fontSize={isMobile ? 10 : 12}
          fill="#4B5563"
          dy={3}
        >
          {displayText}
        </text>
      );
    };

    return (
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius={isMobile ? "70%" : "80%"}
          data={sortedTopics}
          margin={{
            top: isMobile ? 15 : 20,
            right: isMobile ? 20 : 30,
            left: isMobile ? 20 : 30,
            bottom: isMobile ? 15 : 20,
          }}
        >
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="topic" tick={renderTick} tickLine={false} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: isMobile ? 8 : 10 }}
            stroke="#9CA3AF"
          />
          <Radar
            name="Accuracy"
            dataKey="accuracy"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.4}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Accuracy"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: isMobile ? "11px" : "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderDifficultyPerformance = () => {
    if (
      !reportData?.difficultyWisePerformance ||
      reportData.difficultyWisePerformance.length === 0
    ) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-500">
          No difficulty data available
        </div>
      );
    }

    const validDifficulties = reportData.difficultyWisePerformance.filter(
      (item) => item.questions > 0
    );

    if (validDifficulties.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-500">
          No difficulty data available
        </div>
      );
    }

    const difficultyData = validDifficulties.map((item, index) => ({
      ...item,
      accuracy: parseFloat(item.accuracy.toFixed(2)),
      color: COLORS[index % COLORS.length],
    }));

    const CustomTooltip = ({
      active,
      payload,
      label,
    }: DifficultyTooltipProps) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold capitalize">{label}</p>
            <p className="text-blue-600">Accuracy: {payload[0].value}%</p>
          </div>
        );
      }
      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
        <BarChart
          data={difficultyData}
          margin={{
            top: isMobile ? 15 : 20,
            right: isMobile ? 20 : 30,
            left: isMobile ? 15 : 20,
            bottom: isMobile ? 15 : 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="difficulty"
            tick={{ fontSize: isMobile ? 11 : 12 }}
            tickFormatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="accuracy" name="Accuracy" radius={[4, 4, 0, 0]}>
            {difficultyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const StatItem: React.FC<StatItemProps> = ({
    label,
    value,
    icon,
    trend,
    trendValue,
  }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-3 p-2 bg-white dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`${isMobile ? "text-lg" : "text-xl"} font-bold`}>
            {value}
          </p>
        </div>
      </div>
      {trend && trendValue && (
        <div
          className={`text-sm ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
        >
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Mobile Menu Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center justify-between w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex items-center">
              <BarChartIcon
                className="mr-2 sm:mr-3 text-indigo-600 dark:text-indigo-400"
                size={isMobile ? 28 : 36}
              />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                  Test Analysis
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                  Analyze your test results and improve performance
                </p>
              </div>
            </div>
            <button
              className="sm:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            <div className="flex items-center">
              <AlertTriangle className="mr-2" size={isMobile ? 16 : 20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Overall Statistics - Responsive Grid */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
            <Trophy
              className="mr-2 text-yellow-500"
              size={isMobile ? 18 : 20}
            />
            Overall Performance Summary
          </h2>
          <div
            className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 gap-4"}`}
          >
            <StatItem
              label="Average Score"
              value={`${parseFloat(overallStats.avg_score.toFixed(2))}%`}
              icon={
                <TrendingUp
                  className="text-indigo-600 dark:text-indigo-400"
                  size={isMobile ? 16 : 20}
                />
              }
              trend="up"
              trendValue="+2.5%"
            />
            <StatItem
              label="Total Tests"
              value={overallStats.totalAttempts}
              icon={
                <BarChartIcon
                  className="text-blue-600 dark:text-blue-400"
                  size={isMobile ? 16 : 20}
                />
              }
              trend="up"
              trendValue="+3"
            />
            <StatItem
              label="Avg. Attempted"
              value={`${parseFloat(overallStats.avg_attempted_questions.toFixed(2))}`}
              icon={
                <Users
                  className="text-green-600 dark:text-green-400"
                  size={isMobile ? 16 : 20}
                />
              }
              trend="neutral"
            />


            {/* <StatItem
              label="Avg. Accuracy"
              value={`${parseFloat((overallStats.avg_accuracy * 100).toFixed(2))}%`}
              icon={
                <Target
                  className="text-purple-600 dark:text-purple-400"
                  size={isMobile ? 16 : 20}
                />
              }
              trend="up"
              trendValue="+1.2%"
            /> */}


          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Submissions List - Mobile Drawer */}
          <div
            className={`
            ${
              isMobile
                ? `fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
               transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:w-full lg:flex-1 lg:max-w-sm`
                : "w-full lg:flex-1 lg:max-w-sm"
            }
            bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6
          `}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold flex items-center text-gray-900 dark:text-white">
                <Target
                  className="mr-2 text-indigo-600 dark:text-indigo-400"
                  size={isMobile ? 18 : 20}
                />
                Test Submissions
              </h2>
              {!isMobile && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {submissions.length} tests
                </span>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Target
                  size={isMobile ? 36 : 48}
                  className="mx-auto mb-3 opacity-50"
                />
                <p className="text-sm sm:text-base">
                  No test submissions found
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  Take a test to see your analysis here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-200px)] sm:max-h-[500px] overflow-y-auto pr-2">
                {submissions.map((sub, idx) => (
                  <button
                    key={sub.id}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                      selectedSubmission?.id === sub.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => handleSubmissionClick(sub)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-xs sm:text-sm">
                            {idx +
                              1 +
                              ". " +
                              (isMobile
                                ? sub.exam.title.substring(0, 20) +
                                  (sub.exam.title.length > 20 ? "..." : "")
                                : sub.exam.title)}
                          </span>
                          {selectedSubmission?.id === sub.id && (
                            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-xs opacity-75 flex items-center">
                          <Calendar size={10} className="mr-1" />
                          {new Date(sub.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            ...(!isMobile && { year: "numeric" }),
                          })}
                          {!isMobile && <span className="mx-1">•</span>}
                          {!isMobile &&
                            new Date(sub.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                        </p>
                      </div>
                      <ChevronRight
                        size={isMobile ? 16 : 20}
                        className={
                          selectedSubmission?.id === sub.id
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Overlay */}
          {isMobile && isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Report Display */}
          <div className="flex-1 lg:col-span-2">
            {loading ? (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Loading detailed report...
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            ) : reportData ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Overall Performance */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center text-gray-900 dark:text-white mb-2 sm:mb-0">
                      <TrendingUp
                        className="mr-2 text-green-600 dark:text-green-400"
                        size={isMobile ? 18 : 20}
                      />
                      Performance Overview
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedSubmission?.exam.title}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <div className="lg:w-1/2">{renderPerformanceDonut()}</div>
                    <div className="lg:w-1/2 space-y-4">
                      <div
                        className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 gap-4"}`}
                      >
                        {[
                          {
                            label: "Score",
                            value: `${
                              typeof reportData.overallPerformance.score ===
                              "number"
                                ? reportData.overallPerformance.score.toFixed(1)
                                : reportData.overallPerformance.score
                            }%`,
                            icon: (
                              <TrendingUp
                                className="text-green-600 dark:text-green-400"
                                size={isMobile ? 16 : 20}
                              />
                            ),
                            bgColor: "bg-green-50 dark:bg-green-900/20",
                          },
                          {
                            label: "Accuracy",
                            value: `${(
                              reportData.overallPerformance.accuracy * 100
                            ).toFixed(1)}%`,
                            icon: (
                              <Target
                                className="text-blue-600 dark:text-blue-400"
                                size={isMobile ? 16 : 20}
                              />
                            ),
                            bgColor: "bg-blue-50 dark:bg-blue-900/20",
                          },
                          // {
                          //   label: "Rank",
                          //   value: `#${reportData.overallPerformance.rank}`,
                          //   icon: (
                          //     <Trophy
                          //       className="text-yellow-600 dark:text-yellow-400"
                          //       size={isMobile ? 16 : 20}
                          //     />
                          //   ),
                          //   bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                          // },
                          // {
                          //   label: "Percentile",
                          //   value: `${reportData.overallPerformance.percentile.toFixed(1)}%`,
                          //   icon: (
                          //     <Award
                          //       className="text-purple-600 dark:text-purple-400"
                          //       size={isMobile ? 16 : 20}
                          //     />
                          //   ),
                          //   bgColor: "bg-purple-50 dark:bg-purple-900/20",
                          // },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`${item.bgColor} p-3 sm:p-4 rounded-lg`}
                          >
                            <div className="flex items-center mb-1 sm:mb-2">
                              <div className="p-1 sm:p-1.5 rounded-md bg-white dark:bg-gray-700 mr-2">
                                {item.icon}
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                {item.label}
                              </span>
                            </div>
                            <p
                              className={`${isMobile ? "text-lg" : "text-xl sm:text-2xl"} font-bold text-gray-900 dark:text-white`}
                            >
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Additional stats */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Test Details
                        </h4>
                        <div
                          className={`grid ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-2 gap-3"} text-xs sm:text-sm`}
                        >
                          {[
                            {
                              label: "Total Questions:",
                              value:
                                reportData.overallPerformance.totalQuestions,
                            },
                            {
                              label: "Attempted:",
                              value:
                                reportData.overallPerformance
                                  .attemptedQuestions,
                            },
                            {
                              label: "Correct:",
                              value:
                                reportData.overallPerformance.correctAnswers,
                              color: "text-green-600 dark:text-green-400",
                            },
                            {
                              label: "Incorrect:",
                              value:
                                reportData.overallPerformance
                                  .attemptedQuestions -
                                reportData.overallPerformance.correctAnswers,
                              color: "text-red-600 dark:text-red-400",
                            },
                            {
                              label: "Score:",
                              value: `${typeof reportData.overallPerformance.score === "number" ? reportData.overallPerformance.score.toFixed(1) + "%" : reportData.overallPerformance.score}`,
                              color: "text-purple-600 dark:text-purple-400",
                            },
                            {
                              label: "Accuracy:",
                              value: `${(reportData.overallPerformance.accuracy * 100).toFixed(0)}%`,
                              color: "text-blue-600 dark:text-blue-400",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                {item.label}
                              </span>
                              <span
                                className={`font-medium ${item.color || ""}`}
                              >
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topic & Difficulty Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-white">
                      <BookOpen
                        className="mr-2 text-pink-600 dark:text-pink-400"
                        size={isMobile ? 16 : 20}
                      />
                      Topic Performance
                    </h3>
                    {renderTopicPerformance()}

                    {reportData.topicWisePerformance &&
                      reportData.topicWisePerformance.length > 0 && (
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <p>
                            <span className="font-medium">Best Topic:</span>{" "}
                            {
                              [...reportData.topicWisePerformance].sort(
                                (a, b) => b.accuracy - a.accuracy
                              )[0]?.topic
                            }{" "}
                            (
                            {Math.max(
                              ...reportData.topicWisePerformance.map(
                                (t) => t.accuracy
                              )
                            ).toFixed(1)}
                            %)
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-white">
                      <AlertTriangle
                        className="mr-2 text-amber-600 dark:text-amber-400"
                        size={isMobile ? 16 : 20}
                      />
                      Difficulty Performance
                    </h3>
                    {renderDifficultyPerformance()}

                    {reportData.difficultyWisePerformance &&
                      reportData.difficultyWisePerformance.length > 0 && (
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <p>
                            <span className="font-medium">
                              Highest Accuracy:
                            </span>{" "}
                            {
                              [...reportData.difficultyWisePerformance].sort(
                                (a, b) => b.accuracy - a.accuracy
                              )[0]?.difficulty
                            }{" "}
                            (
                            {Math.max(
                              ...reportData.difficultyWisePerformance.map(
                                (d) => d.accuracy
                              )
                            ).toFixed(1)}
                            %)
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Time Management & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-white">
                      <Clock
                        className="mr-2 text-blue-600 dark:text-blue-400"
                        size={isMobile ? 16 : 20}
                      />
                      Time Management
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        {
                          label: "Total Time Taken",
                          value: formatTime(
                            reportData.timeManagement.totalTimeTaken
                          ),
                          icon: (
                            <Clock
                              className="text-blue-600 dark:text-blue-400"
                              size={isMobile ? 16 : 20}
                            />
                          ),
                        },
                        {
                          label: "Avg. Time per Question",
                          value: `${reportData.timeManagement?.averageTimePerQuestion?.toFixed(1) || "0.0"} min`,
                          icon: (
                            <Clock
                              className="text-blue-600 dark:text-blue-400"
                              size={isMobile ? 16 : 20}
                            />
                          ),
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="mr-2 sm:mr-3">{item.icon}</div>
                            <div>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {item.label}
                              </span>
                              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {reportData.timeManagement?.averageTimePerQuestion &&
                        reportData.timeManagement.averageTimePerQuestion > 2
                          ? "Consider practicing to improve your speed. Try timed quizzes."
                          : "Good time management! You're working at an efficient pace."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-white">
                      <Award
                        className="mr-2 text-purple-600 dark:text-purple-400"
                        size={isMobile ? 16 : 20}
                      />
                      Strengths & Areas to Improve
                    </h3>

                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <ArrowUpCircle
                          className="text-green-600 dark:text-green-400 mr-2"
                          size={isMobile ? 16 : 20}
                        />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          Strengths
                        </h4>
                      </div>
                      {reportData.strengthsAndWeaknesses.strengths.length >
                      0 ? (
                        <ul className="space-y-1 sm:space-y-2">
                          {reportData.strengthsAndWeaknesses.strengths.map(
                            (item, i) => (
                              <li
                                key={i}
                                className="flex items-start p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                              >
                                <CheckCircle
                                  className="text-green-600 dark:text-green-400 mr-2 mt-0.5"
                                  size={14}
                                />
                                <span className="text-green-800 dark:text-green-300 text-xs sm:text-sm">
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic text-xs sm:text-sm pl-5 sm:pl-6">
                          Keep practicing to develop strengths
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-2 sm:mb-3">
                        <ArrowDownCircle
                          className="text-red-600 dark:text-red-400 mr-2"
                          size={isMobile ? 16 : 20}
                        />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          Areas to Improve
                        </h4>
                      </div>
                      {reportData.strengthsAndWeaknesses.weaknesses.length >
                      0 ? (
                        <ul className="space-y-1 sm:space-y-2">
                          {reportData.strengthsAndWeaknesses.weaknesses.map(
                            (item, i) => (
                              <li
                                key={i}
                                className="flex items-start p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                              >
                                <XCircle
                                  className="text-red-600 dark:text-red-400 mr-2 mt-0.5"
                                  size={14}
                                />
                                <span className="text-red-800 dark:text-red-300 text-xs sm:text-sm">
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic text-xs sm:text-sm pl-5 sm:pl-6">
                          No specific areas identified for improvement
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggested Improvements */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-white">
                    <Target
                      className="mr-2 text-indigo-600 dark:text-indigo-400"
                      size={isMobile ? 16 : 20}
                    />
                    Suggested Improvements
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {reportData.suggestedImprovements &&
                    Array.isArray(reportData.suggestedImprovements) &&
                    reportData.suggestedImprovements.length > 0 ? (
                      reportData.suggestedImprovements
                        .slice(0, isMobile ? 2 : undefined)
                        .map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30"
                          >
                            <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                              <span className="text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-900 dark:text-white text-sm sm:text-base">
                                {suggestion}
                              </span>
                              <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                                <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full">
                                  Action Item
                                </span>
                                <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded-full">
                                  Priority: {index < 2 ? "High" : "Medium"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                        <Target
                          size={isMobile ? 36 : 48}
                          className="mx-auto mb-2 sm:mb-3 opacity-30"
                        />
                        <p className="text-sm sm:text-base">
                          No suggested improvements available
                        </p>
                        <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                          Keep practicing to get personalized suggestions
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-full flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Target
                    size={isMobile ? 48 : 64}
                    className="mx-auto mb-3 sm:mb-4 opacity-30"
                  />
                  <p className="text-base sm:text-lg mb-1 sm:mb-2">
                    No Report Selected
                  </p>
                  <p className="text-xs sm:text-sm max-w-md mx-auto px-2">
                    {isMobile
                      ? "Select a test from the menu"
                      : "Select a test from the submissions list to view detailed performance analysis, insights, and improvement suggestions."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalysisDashboard;
