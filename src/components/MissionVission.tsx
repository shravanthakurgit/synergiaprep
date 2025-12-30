"use client";

import * as React from "react";
import Card from "./Card";

export function MissionVission() {
  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto text-center">
      {/* Header Button */}
      <div className="inline-block bg-blue-200 text-blue-700 font-bold px-6 py-2 rounded-full text-lg shadow mb-6">
        Mission & Vision
      </div>

      {/* Heading & Subtext */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Your Partner in Global Education Success
      </h1>

      <p className="text-gray-600 max-w-6xl mx-auto mb-12 text-base sm:text-lg leading-relaxed">
        Empowering students to achieve their academic and professional dreams
        through expert guidance and personalized support
      </p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 place-items-center">
        {/* Vision */}
        <div className="transform transition duration-300 md:hover:shadow-2xl md:hover:scale-105 w-full flex justify-center">
          <Card
            img="/assets/images/vision.jpeg"
            h="Our Vision"
            p="To empower learners and educators worldwide by providing cutting edge AI tools, seamless research capabilities, and an intuitive digital ecosystem that fuels innovation and academic growth"
            sectionId="vision"
            className="w-full max-w-sm min-h-[520px] sm:min-h-[600px] bg-blue-100 rounded-3xl shadow-md p-6"
          />
        </div>

        {/* Mission */}
        <div className="transform transition duration-300 md:hover:shadow-2xl md:hover:scale-105 w-full flex justify-center">
          <Card
            img="/assets/images/mission.jpeg"
            h="Our Mission"
            p="To empower students across diverse fields and career aspirations by delivering a cutting-edge educational platform that enables them to prepare, practice, and succeed in their exams"
            sectionId="mission"
            className="w-full max-w-sm min-h-[520px] sm:min-h-[600px] bg-blue-100 rounded-3xl shadow-md p-6"
          />
        </div>

        {/* Core Values */}
        <div className="transform transition duration-300 md:hover:shadow-2xl md:hover:scale-105 w-full flex justify-center">
          <Card
            img="/assets/images/coreValue.jpg"
            h="Core Value"
            p="Creating opportunities for every student, regardless of their background, by providing accessible and comprehensive educational resources. Maintaining transparency and trust in all services, ensuring fairness and reliability for students, partners, and stakeholders"
            sectionId="core-values"
            className="w-full max-w-sm min-h-[520px] sm:min-h-[600px] bg-blue-100 rounded-3xl shadow-md p-6"
          />
        </div>
      </div>
    </section>
  );
}

export default MissionVission;
