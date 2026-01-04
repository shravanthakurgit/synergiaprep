"use client";

import * as React from "react";

export function About() {
  return (
    <>
      <div className="px-6 pt-10 pb-15 bg-white sm:pt-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-200 text-blue-700 font-bold px-6 py-2 rounded-full text-lg shadow">
            About Us
          </div>
        </div>

        <p className="max-w-6xl mx-auto text-center text-gray-700 text-base sm:text-lg leading-relaxed">
          At SynergiaPrep Pvt Ltd, we empower students with the tools, guidance,
          and global opportunities they need to succeed — whether it&apos;s
          preparing for competitive exams or securing admission to top
          international universities.
          <br />
          <br />
          Our platform brings together the best of both worlds: expert-led
          online exam preparation for entrance and government exams like JEE,
          NEET, WBJEE, and more, along with personalized study abroad
          consultancy that opens doors to world-class institutions.
          <br />
          <br />
          With a team of experienced mentors, dynamic learning resources, and
          transparent guidance at every step, SynergiaPrep is your one-stop
          solution for academic success both at home and abroad.
        </p>
      </div>

      <div className="px-6 py-8 flex flex-wrap justify-center gap-12 bg-white text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">4K+</p>
          <p className="text-gray-700">Students Placed Globally</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">20K+</p>
          <p className="text-gray-700">Classes</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">92%</p>
          <p className="text-gray-700">Success Rate</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">40</p>
          <p className="text-gray-700">Global Universities Partnered</p>
        </div>
      </div>
    </>
  );
}

export default About;
