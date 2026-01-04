"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PiHandTapBold } from "react-icons/pi";
import { RiGlobalLine } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa";
import { FeaturesItem } from "./featuresItem";
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Hero() {
  return (
    <>
      {/* Hero section */}
      <section className="w-full bg-[#0055ff] py-20 lg:py-24 relative z-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-4 sm:px-6 md:px-8 gap-8 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-3/5 xl:w-3/4">
            <div className="w-full p-4 sm:p-6 md:p-8 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,_transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,_transparent_2px)] bg-[size:20px_20px] sm:bg-[size:30px_30px] md:bg-[size:40px_40px] rounded-xl">
              <div className="text-xs sm:text-sm md:text-base text-white font-semibold uppercase tracking-wide mb-3">
                India&apos;s Front-running Startup
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug lg:leading-tight mb-4 sm:mb-6">
                Revolutionizing Exam Preparation with Tech Innovation
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-3 sm:mb-4">
                Your Journey, Our Spark of Innovation
              </p>

              <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                AI personalized guidance and support to help you spark on exam
                preparation with world&apos;s top educational opportunities.
              </p>

              {/* Alumni + CTA */}
              <div className="mt-6 sm:mt-8 space-y-4">
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wide">
                  Built by Alumni from
                </p>

                {/* BIG JU LOGO */}
                <div className="bg-white rounded-lg sm:rounded-xl px-4 py-3 sm:px-7 sm:py-4 shadow-xl inline-flex items-center justify-center">
                  <Image
                    src="/assets/images/JUlogo.png"
                    alt="Jadavpur University Alumni"
                    width={130}
                    height={60}
                    className="object-contain w-[120px] sm:w-[150px] md:w-[170px]"
                  />
                </div>

                {/* Learn More */}
                <div>
                  <Link href="/#about">
                    <button className="px-5 py-2.5 sm:px-7 sm:py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors text-sm sm:text-base">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Center Image Only */}
          <div className="w-full lg:w-2/5 xl:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg sm:rounded-xl p-2 shadow-lg shadow-blue-900/20 w-full max-w-2xl">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/Header-img.jpg"
                  alt="Symbolic representation of exam preparation innovation"
                  fill
                  className="object-contain p-2"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <div className="relative w-full mb-[-4rem] sm:mb-[-6rem] px-4 sm:px-6 z-10">
        <div className="max-w-7xl mx-auto mt-8 sm:mt-16 md:mt-20 lg:-translate-y-24 xl:-translate-y-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 lg:px-10">
            <FeaturesItem
              icon={<PiHandTapBold className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="AI-Powered Learning"
              description="Leverage AI to enhance your learning experience with personalized study paths."
            />
            <FeaturesItem
              icon={<RiGlobalLine className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Global Awareness"
              description="Stay informed about global events and educational trends that matter."
            />
            <FeaturesItem
              icon={<FaDatabase className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Smart Analytics"
              description="Track your progress with comprehensive performance analytics."
            />
          </div>
        </div>
      </div>

      {/* Joddha Section - Big Card */}
      <div className="relative w-full px-4 sm:px-6 mt-24 sm:mt-2 md:mt-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-6 sm:p-8 md:p-12">
              {/* LEFT SIDE */}
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {`"Joddha" - Our YouTube Initiative`}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-700 mb-6">
                    {`Bengal's Brightest, Building Bengal's Future.`}
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {`Joddha is more than just a startup; it is a movement to
                    revolutionize education in our state. Founded by a
                    prestigious group of Doctors, Engineers, and Alums of
                    Jadavpur University, we combine academic rigor with local
                    insight to help every student become a "Joddha" (Warrior) in
                    their field.`}
                  </p>
                </div>

                {/* Social Media Logos - Icons Only */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium text-sm sm:text-base">
                    Follow us on:
                  </p>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebook className="w-6 h-6 text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                      aria-label="YouTube"
                    >
                      <FaYoutube className="w-6 h-6 text-red-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="w-6 h-6 text-pink-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="w-6 h-6 text-blue-700" />
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - YouTube Video */}
              <div className="bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full aspect-video">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                    title="Joddha YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-center text-gray-600 font-medium text-sm sm:text-base">
                    Watch our latest video on Joddha initiative
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
