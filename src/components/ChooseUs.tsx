"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

const accordionItems: AccordionItem[] = [
  {
    title: "Expert Guidance",
    content:
      "With years of experience in educational consulting, our team provides expert insights to help you make informed decisions and stand out in the competitive admissions process.",
  },
  {
    title: "Personalized Support",
    content:
      "Tailored advice and mentorship to suit your specific academic and career goals.",
  },
  {
    title: "Comprehensive Services",
    content:
      "From test prep to visa counseling, our complete support services help at every step.",
  },
  {
    title: "Global Partnerships",
    content:
      "Our collaboration with institutions worldwide opens up endless opportunities for students.",
  },
];

export function ChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    contentRefs.current.forEach((el, index) => {
      if (!el) return;
      el.style.maxHeight = openIndex === index ? `${el.scrollHeight}px` : "0px";
    });
  }, [openIndex]);

  return (
    <div className="mt-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Section */}
        <div className="md:w-1/2 md:sticky md:top-24 h-fit">
          <div className="inline-block bg-blue-200 text-blue-700 font-bold px-6 py-2 rounded-full text-lg shadow mb-6">
            Why Choose Us?
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Your Trusted Partner in Global Education
          </h2>

          <p className="mt-6 text-gray-700 text-base leading-relaxed">
            We provide comprehensive support to make studying abroad seamless
            and accessible. With our expert team, you can confidently navigate
            every step, from choosing the right program to settling in your new
            country.
          </p>
        </div>

        {/* Right Section - Accordion */}
        <div className="md:w-1/2 w-full">
          {accordionItems.map((item, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between gap-4 text-left py-5 text-[16px] sm:text-[17px] font-medium text-gray-800 hover:text-blue-600 transition"
              >
                <span className="flex-1">{item.title}</span>

                <svg
                  className={`w-5 h-5 flex-shrink-0 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="overflow-hidden max-h-0 transition-all duration-500 ease-in-out"
              >
                <p className="pb-5 text-gray-600 text-sm sm:text-base">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChooseUs;
