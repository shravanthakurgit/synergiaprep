"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Course } from "@/type/course";
import { Play } from "lucide-react";

interface CourseCarouselProps {
  courses?: Course[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showControls?: boolean;
}

// Define gradient presets based on your reference image
const gradientPresets = ["linear-gradient(135deg, #0a1128, #001f54, #034078)"];

export default function CourseCarousel({
  courses: propCourses,
  autoScroll = true,
  autoScrollInterval = 5000,
  showControls = true,
}: CourseCarouselProps) {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>(propCourses || []);
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!propCourses);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const [itemsPerView, setItemsPerView] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Get gradient for a course based on index
  const getCourseGradient = (index: number) => {
    return gradientPresets[index % gradientPresets.length];
  };

  // Responsive items per view with better mobile handling
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(1.2); // Slightly more than 1 for better mobile peek
      } else if (width < 1024) {
        setItemsPerView(1.8); // Almost 2 for tablets
      } else if (width < 1280) {
        setItemsPerView(2.5); // Between 2 and 3
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    const handleResize = () => {
      updateItemsPerView();
      // Reset carousel position on resize
      setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch courses if not provided via props
  useEffect(() => {
    if (propCourses) return;

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/courses");

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.warn("Received non-array data");
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
        setError("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [propCourses]);

  // Fetch user enrolled courses
  useEffect(() => {
    async function fetchUserCourses() {
      try {
        const userid = session?.user?.id;
        if (!userid) return;

        const response = await fetch(`/api/v1/courses/users/${userid}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user courses: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setUserCourses(data.data.map((course: Course) => course.id));
        } else {
          setUserCourses([]);
        }
      } catch (error) {
        console.error("Error fetching user courses:", error);
        setUserCourses([]);
      }
    }

    fetchUserCourses();
  }, [session?.user?.id]);

  // Calculate the number of slides
  const totalSlides = Math.ceil(courses.length / itemsPerView);
  const canGoNext = currentIndex < totalSlides - 1;
  const canGoPrev = currentIndex > 0;

  // Slide navigation functions
  const nextSlide = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [canGoNext]);

  const prevSlide = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(totalSlides - 1);
    }
  }, [canGoPrev, totalSlides]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (
      !isAutoScrolling ||
      courses.length <= itemsPerView ||
      totalSlides <= 1
    ) {
      return;
    }

    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }

      autoScrollTimerRef.current = setTimeout(() => {
        nextSlide();
      }, autoScrollInterval);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
    };
  }, [
    isAutoScrolling,
    currentIndex,
    courses.length,
    autoScrollInterval,
    itemsPerView,
    totalSlides,
    nextSlide,
  ]);

  // Handle mouse/touch events
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (autoScroll) {
      setIsAutoScrolling(true);
    }
  };

  // Touch swipe functionality with better mobile handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
    setIsAutoScrolling(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) {
      setIsAutoScrolling(autoScroll);
      return;
    }

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    // Restart auto-scroll after swipe
    setTimeout(() => {
      if (autoScroll) {
        setIsAutoScrolling(true);
      }
    }, 1000);
  };

  // Add shine animation keyframes
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shine {
        0%, 100% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Loading state
  if (isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses available.</p>
      </div>
    );
  }

  // Fix: Handle cases where totalSlides might be 0
  const safeTotalSlides = Math.max(1, totalSlides);
  const safeCurrentIndex = currentIndex >= safeTotalSlides ? 0 : currentIndex;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${safeCurrentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="flex-shrink-0 px-2 sm:px-3 py-3"
              style={{
                width: `${100 / itemsPerView}%`,
                minWidth: `${100 / itemsPerView}%`,
              }}
            >
              <div
                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg
                transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl 
                border border-gray-200/50 h-full flex flex-col
                group hover:border-blue-300 mx-4 sm:mx-2 min-h-[300px]`}
              >
                {/* Premium badge with ribbon effect - Mobile optimized */}
                <div
                  className={`absolute top-2 right-0 z-20
    ${
      course.price > 0
        ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-gray-900"
        : "bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white"
    }
    text-[10px] sm:text-[11px] font-bold py-[5px] sm:py-[6px] 
    px-12 sm:px-14 shadow-lg transform rotate-45
    translate-x-[35px] sm:translate-x-[40px] translate-y-[15px] sm:translate-y-[18px]
    border-l border-r border-white/20`}
                >
                  {course.price > 0 ? "PREMIUM" : "COMING SOON"}
                </div>

                {/* Card content - Single structure for all cards */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Gradient header - same for all cards */}
                  <div
                    className={`relative text-white overflow-hidden flex flex-col justify-center flex-grow
                      ${course.price === 0 ? "rounded-2xl" : "rounded-t-2xl"}
                      ${
                        course.price === 0
                          ? "items-center text-center px-4 sm:px-6"
                          : "px-4 sm:px-6 py-6 sm:py-10"
                      }
                    `}
                    style={{ background: getCourseGradient(index) }}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />

                    {/* Shine effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      style={{ animation: "shine 3s ease-in-out infinite" }}
                    />

                    <div
                      className={`relative z-10 ${course.price === 0 ? "py-8 sm:py-12" : ""}`}
                    >
                      <h3
                        className={`font-bold leading-tight mb-2 sm:mb-3
                          ${
                            course.price === 0
                              ? "text-2xl sm:text-3xl md:text-4xl"
                              : "text-xl sm:text-2xl md:text-3xl line-clamp-2"
                          }
                        `}
                      >
                        {course.title}
                      </h3>

                      <p
                        className={`text-white/90 font-medium uppercase tracking-wider
                          ${course.price === 0 ? "text-base sm:text-lg md:text-xl" : "text-sm sm:text-base"}
                        `}
                      >
                        {course.subtitle || "Mock Paper"}
                      </p>
                    </div>
                  </div>

                  {/* Price section - Only for premium courses */}
                  {course.price > 0 && (
                    <div className="p-3 sm:p-4 md:p-5 bg-white rounded-b-2xl border-t border-gray-100">
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                            ₹
                            {Math.max(0, course.price - (course.discount || 0))}
                          </span>
                          {course.discount && course.discount > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ₹{course.price}
                              </span>
                              <span className="text-[10px] sm:text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                                Save ₹{course.discount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {userCourses.includes(course.id) ? (
                        <Link href={`/courses/${course.id}`} className="block">
                          <Button
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 
                              hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold 
                              py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg
                              text-sm"
                          >
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout?courseId=${course.id}`}
                          className="block"
                        >
                          <Button
                            className="w-full bg-gradient-to-r from-[#001f54] to-[#034078] 
                              hover:from-[#001a46] hover:to-[#023a6e] text-white font-semibold 
                              py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg 
                              hover:scale-[1.02] text-sm"
                          >
                            Enroll Now
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile navigation dots and swipe hint */}
      {safeTotalSlides > 1 && (
        <>
          {/* Mobile swipe hint */}
          <div className="block sm:hidden text-center mt-6 mb-2">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <span className="animate-pulse">← Swipe →</span>
            </div>
          </div>

          {/* Dots Indicator - Mobile optimized */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
            {Array.from({ length: safeTotalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === safeCurrentIndex
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 w-6 sm:w-8 md:w-10 h-1.5 sm:h-3"
                    : "bg-gray-300 hover:bg-gray-400 w-1.5 sm:w-3 h-1.5 sm:h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
