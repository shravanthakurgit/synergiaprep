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
      <section className="w-full min-h-[80vh] bg-[#0055ff] py-28 relative z-0">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center pl-4 pr-0 gap-10">
          
          {/* Left Side with GRID Background */}
          <div className="w-full md:w-3/4 flex justify-center items-center">
            <div
              className="w-full max-w-4xl p-4 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,_transparent_3px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,_transparent_3px)] bg-[size:50px_50px] bg-[position:25px_25px]"
            >
              <div className="text-base text-white font-semibold uppercase py-6">
                India&apos;s Front-running Startup
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight pb-8 pt-1">
                Revolutionizing Exam Preparation with Tech Innovation
              </h1>

              <p className="text-2xl text-white pb-4">
                Your Journey, Our Spark of Innovation
              </p>

              <p className="text-white text-base">
                AI personalized guidance and support to help you spark on exam preparation with world&apos;s top educational opportunities.
              </p>

              <div className="py-4">
                <Link href="/#about">
                  <button className="mt-4 px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 duration-500 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="w-full md:w-1/2 flex justify-center items-center pt-10">
            <div className="bg-white rounded-xl p-1 shadow-lg">
              <Image
                src="/assets/images/Header-img.jpg"
                alt="Symbolic"
                width={400}
                height={300}
                className="w-full max-w-sm rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* Overlapping Feature Cards */}
        <div className="absolute w-full left-0 px-6 -bottom-56 z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-10">
            <FeaturesItem
              icon={<PiHandTapBold size={28} />}
              title="AI-Powered Learning"
              description="Leverage AI to enhance your learning experience."
            />
            <FeaturesItem
              icon={<RiGlobalLine size={28} />}
              title="Global Awareness"
              description="Stay informed about global events and trends."
            />
            <FeaturesItem
              icon={<FaDatabase size={28} />}
              title="Database Management"
              description="Manage and optimize your databases."
            />
          </div>
        </div>
      </section>

      {/* Extra space below to accommodate the overlapped section */}
      <div className="mt-40" />
    </>
  );
}

export default Hero;


