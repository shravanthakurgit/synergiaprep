"use client";

import React, { useEffect } from "react";
import {
  Eye,
  Star,
  Globe,
  Lightbulb,
  Shield,
  Users,
  CheckCircle,
  Target,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const AboutCompany = () => {
  const router = useRouter();

  // Handle scrolling to section on page load with offset
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 160;
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const values = [
    {
      icon: Globe,
      title: "Inclusivity",
      description:
        "Creating opportunities for every student, regardless of their background, by providing accessible and comprehensive educational resources.",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "Committed to delivering the highest quality of learning experiences through expertise and innovation.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously advancing technology in AI/ML, Materials Science, and IoT to redefine education.",
    },
    {
      icon: CheckCircle,
      title: "Empowerment",
      description:
        "Helping students take control of their academic and professional journeys.",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description:
        "Preparing students for global opportunities through international programs.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "Maintaining transparency, trust, and fairness in everything we do.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Building strong partnerships with institutions and industry leaders.",
    },
  ];

  const missionHighlights = [
    "Empowering students across diverse fields with cutting-edge educational solutions",
    "Being a reliable partner in every student’s journey to success",
    "Providing AI/ML-powered personalized exam preparation and insights",
    "Bridging academic and professional growth through internships and certifications",
    "Creating global opportunities via innovation and study-abroad consultations",
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 py-10 md:py-20 flex flex-col items-center bg-gradient-to-b from-[#3a59e4] via-blue-400 to-blue-300 text-white">
        <div className="max-w-6xl w-full text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Transforming Education, Empowering Futures
          </h2>

          {/* Mission */}
          <Card
            id="mission"
            className="bg-transparent border-none shadow-none mb-16"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Rocket className="w-7 h-7" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {missionHighlights.map((item, index) => (
                <React.Fragment key={item}>
                  <div className="flex items-start gap-3 text-left">
                    <Target className="w-5 h-5 mt-1" />
                    <p className="text-sm md:text-base">{item}</p>
                  </div>
                  {index < missionHighlights.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {/* Vision */}
          <Card
            id="vision"
            className="bg-transparent border-none shadow-none mb-10"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Eye className="w-6 h-6" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm md:text-base space-y-4">
              <p>
                To be the most trusted and innovative EduTech platform globally,
                transforming how students learn, prepare, and succeed.
              </p>
              <p>
                We aim to unlock every learner’s potential by combining advanced
                technology with global educational opportunities.
              </p>
            </CardContent>
          </Card>

          {/* ✅ IMAGES BELOW VISION */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-10">
            <Image
              src="/assets/images/unsplash1.jpg"
              alt="Learning Environment"
              width={600}
              height={400}
              className="w-full h-64 md:h-72 rounded-xl object-cover shadow-lg hover:scale-[1.02] transition-transform duration-300"
            />
            <Image
              src="/assets/images/unsplash2.jpg"
              alt="Future Ready Education"
              width={600}
              height={400}
              className="w-full h-64 md:h-72 rounded-xl object-cover shadow-lg hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* Core Values */}
          <div id="core-values" className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              Our Core Values
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {values.map((value, index) => (
                <AccordionItem
                  key={value.title}
                  value={`item-${index}`}
                  className="mb-2 rounded-lg backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-3">
                      <value.icon className="w-5 h-5" />
                      <span>{value.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-sm md:text-base">
                    {value.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
