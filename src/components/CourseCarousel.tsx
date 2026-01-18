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

// Define gradient presets based on your reference image
const gradientPresets = [
  "linear-gradient(135deg, #262038 50%, #262038 100%, #2c5364 100%)",
  "linear-gradient(135deg, #141E30 0%, #243B55 100%)",
  "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)",
];


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

  // Get gradient for a course based on index
  const getCourseGradient = (index: number) => {
    return gradientPresets[index % gradientPresets.length];
  };

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
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
    <div className="relative w-full max-w-7xl mx-auto">
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
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="w-full flex-shrink-0 px-3"
              style={{ 
                width: `${100 / itemsPerView}%`,
                minWidth: `${100 / itemsPerView}%` 
              }}
            >
            <div className="rounded-2xl bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
 transition-all duration-300 h-full flex flex-col relative overflow-hidden border border-gray-200">

             
                <div className="relative z-10 flex flex-col h-full" >
               
               <div
  className="relative px-6 py-12 text-white"
  style={{ background: getCourseGradient(index) }}
>
  {/* subtle glow overlay */}
  <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

  {/* Premium badge */}
  <div className="absolute rotate-45 w-40 top-5 px-4 -right-12 bg-rose-500 text-white text-xs font-bold py-1 rounded-full shadow">
   {course.price > 0 ? course.level : "Coming Soon"}
  </div>

  <div className="relative z-10">
    <h3 className="text-2xl font-extrabold tracking-wide mb-1">
      {course.title}
    </h3>

    <p className="text-sm text-white/80 font-medium">
      {course.subtitle || "Mock Paper"}
    </p>
  </div>
</div>


               

                  {/* Price Section - Styled like reference */}
              {course?.price > 0 && (  <div className="mt-auto px-6 pb-6 pt-4 text-black">

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        {/* <div className="text-sm mb-1">Starting at</div> */}
                        <div className="flex items-baseline gap-2">
                          <span className="line-through  text-md text-gray-500">
                            ₹{course.price}
                          </span>
                          <span className="font-bold text-2xl">
                            ₹{course.price - course.discount}
                          </span>
                        </div>
                      </div>
                      {/* <div className="backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        Save ₹{course.discount}
                      </div> */}
                    </div>

                    {/* Enroll Button */}
                    {userCourses.includes(course.id) ? (
                      <Link href={`/courses/${course.id}`} passHref>
                       <Button
  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
  font-semibold py-6 rounded-xl text-base"
>
  Continue Learning
</Button>

                      </Link>
                    ) : (
                      <Link href={`/checkout?courseId=${course.id}`} passHref>
                      <Button
  className="w-full bg-sky-600 hover:bg-sky-700 text-white
  font-semibold py-6 rounded-md text-base transition-all duration-300"
>
  View Course
</Button>

                      </Link>
                    )}
                    
                  

                  </div>)}


                </div>

            
                
              </div>
            </div>
          ))}
        </div>

        {/* Mobile touch indicators */}
        <div className="flex md:hidden justify-center mt-6">
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span>← Swipe →</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {showControls && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute -left-1 md:left-4 top-1/3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
            disabled={!canGoPrev && !autoScroll}
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-2 md:right-4 top-1/3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
            disabled={!canGoNext && !autoScroll}
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-3 my-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 w-8 md:w-10"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}