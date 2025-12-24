"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PiHandTapBold } from "react-icons/pi";
import { RiGlobalLine } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa";
import { FeaturesItem } from "./featuresItem";

export function Hero() {
  return (
    <>
      {/* Hero section */}
      <section className="w-full bg-[#0055ff] py-12 md:py-20 lg:py-28 relative z-0">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center px-4 sm:px-6 md:px-8 gap-8 md:gap-12 lg:gap-16">
          
          {/* Left Side with GRID Background */}
          <div className="w-full lg:w-3/5 xl:w-3/4 flex justify-center items-center pt-6 md:pt-8 lg:pt-0">
            <div
              className="w-full max-w-4xl p-4 sm:p-6 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,_transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,_transparent_2px)] bg-[size:30px_30px] sm:bg-[size:40px_40px] md:bg-[size:50px_50px] bg-[position:10px_10px] sm:bg-[position:20px_20px] md:bg-[position:25px_25px]"
            >
              <div className="text-xs sm:text-sm md:text-base text-white font-semibold uppercase tracking-wide pb-3 md:pb-4 lg:pb-6">
                India&apos;s Front-running Startup
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight sm:leading-snug md:leading-tight pb-6 md:pb-8 pt-0 md:pt-1">
                Revolutionizing Exam Preparation with Tech Innovation
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-white font-medium pb-3 md:pb-4">
                Your Journey, Our Spark of Innovation
              </p>

              <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-normal">
                AI personalized guidance and support to help you spark on exam preparation with world&apos;s top educational opportunities.
              </p>

              <div className="pt-4 md:pt-6 lg:pt-8">
                <Link href="/#about">
                  <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-800 duration-500 transition-colors text-sm sm:text-base w-full sm:w-auto text-center">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="w-full lg:w-2/5 xl:w-1/2 flex justify-center items-center">
            <div className="bg-white rounded-xl p-1.5 sm:p-2 md:p-3 shadow-lg shadow-blue-900/20 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm xl:max-w-md">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/Header-img.jpg"
                  alt="Symbolic representation of exam preparation innovation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - Separate on mobile, overlapping on desktop */}
      <div className="relative w-full px-4 sm:px-6 -mt-20 md:-mt-32 lg:-mt-40 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4 md:px-8 lg:px-10">
          <FeaturesItem
            icon={<PiHandTapBold className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />}
            title="AI-Powered Learning"
            description="Leverage AI to enhance your learning experience with personalized study paths."
          />
          <FeaturesItem
            icon={<RiGlobalLine className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />}
            title="Global Awareness"
            description="Stay informed about global events and educational trends that matter."
          />
          <FeaturesItem
            icon={<FaDatabase className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />}
            title="Smart Analytics"
            description="Track your progress with comprehensive performance analytics."
          />
        </div>
      </div>

      {/* Extra space below */}
      <div className="mt-12 md:mt-20 lg:mt-24" />
    </>
  );
}

export default Hero;