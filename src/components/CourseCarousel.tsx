"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Course } from "@/type/course";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface CourseCarouselProps {
  courses?: Course[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showControls?: boolean;
}

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
  const [itemsPerView, setItemsPerView] = useState(1); // Start with 1 for mobile
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setItemsPerView(1);
      } else if (width < 1024) { // Tablet
        setItemsPerView(2);
      } else { // Desktop
        setItemsPerView(3);
      }
    };

    updateItemsPerView(); // Initial call
    window.addEventListener("resize", updateItemsPerView);
    
    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  // Fetch courses if not provided via props
  useEffect(() => {
    if (propCourses) return;

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/courses");
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
        const userid = session?.user.id;
        if (!userid) return;

        const response = await fetch(`/api/v1/courses/users/${userid}`);
        const data = await response.json();
        setUserCourses(data.data.map((course: Course) => course.id));
      } catch (error) {
        console.log("Error fetching user courses:", error);
      }
    }

    fetchUserCourses();
  }, [session?.user.id]);

  // Calculate the number of slides
  const totalSlides = Math.ceil(courses.length / itemsPerView);
  const canGoNext = currentIndex < totalSlides - 1;
  const canGoPrev = currentIndex > 0;

  // Slide navigation functions
  const nextSlide = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  }, [canGoNext]);

  const prevSlide = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(totalSlides - 1); // Loop to end
    }
  }, [canGoPrev, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || courses.length <= itemsPerView || totalSlides <= 1) return;

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
  }, [isAutoScrolling, currentIndex, courses.length, autoScrollInterval, itemsPerView, totalSlides, nextSlide]);

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

  // Calculate visible courses with proper slicing
  const getVisibleCourses = () => {
    const start = currentIndex * itemsPerView;
    const end = start + itemsPerView;
    return courses.slice(start, end);
  };

  // Touch swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

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

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">

        <h2 className=" w-full text-center pb-8 ml-4 text-white p-3 text-md">Explore Our Courses</h2>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}

      >
        {/* Sliding container */}
        <div
          className="flex transition-transform duration-500 ease-in-out ml-2 sm:justify-center"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-full flex-shrink-0 px-3"
              style={{ 
                width: `${100 / itemsPerView}%`,
                minWidth: `${100 / itemsPerView}%` 
              }}
            >
              <div className="border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                {/* Course Image */}
                <div className="relative w-full h-48 md:h-56 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={courses.indexOf(course) < 3}
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {course.level}
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex-grow">
                  <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
                    {course.subtitle}
                  </p>

                  {/* Price */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="line-through text-gray-400 mr-2 text-sm md:text-base">
                        ₹{course.price}
                      </span>
                      <span className="font-bold text-green-600 text-lg md:text-xl">
                        ₹{course.price - course.discount}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Save ₹{course.discount}
                    </span>
                  </div>

                  {/* Exam Categories */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Exam Categories:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.examCategories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {category.name}
                        </span>
                      ))}
                      {course.examCategories.length > 3 && (
                        <span className="text-xs text-gray-500 px-1">
                          +{course.examCategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enroll Button */}
                <div className="mt-auto pt-4 border-t">
                  {userCourses.includes(course.id) ? (
                    <Link href={`/courses/${course.id}`} passHref>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/checkout?courseId=${course.id}`} passHref>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Enroll Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile touch indicators */}
        <div className="flex md:hidden justify-center mt-6">
          <div className="text-xs text-white flex items-center gap-2">
            <span>← Swipe →</span>
          </div>
        </div>
      </div>

      
      {showControls && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
            disabled={!canGoPrev && !autoScroll}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
            disabled={!canGoNext && !autoScroll}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 md:mt-8 space-x-2 my-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 w-6 md:w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-scroll toggle */}
      {/* {autoScroll && totalSlides > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all"
            aria-label={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">Pause Auto-scroll</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Resume Auto-scroll</span>
              </>
            )}
          </button>
        </div>
      )}
       */}

      {/* Course counter */}
      {/* <div className="text-center mt-4 text-sm text-gray-500">
        <span className="font-semibold text-blue-600">{currentIndex + 1}</span>
        <span className="mx-2">/</span>
        <span>{totalSlides}</span>
        <span className="ml-2">({courses.length} courses)</span>
      </div> */}


    </div>
  );
}