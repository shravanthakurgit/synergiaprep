import { Hero } from "@/components/Hero";
import { About } from "@/components/about";
import { MissionVission } from "@/components/MissionVission";
import { ChooseUs } from "@/components/ChooseUs";
import { Services } from "@/components/Services";
import Clients from "@/components/Home/Clients";
import { Main } from "@/components/craft";
import ExamCarousel from "@/components/Home/ExamCarousel";
import ExpertsTalk from "@/components/ExpertsTalk";
import Team from "@/components/team";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { BsCheck2Circle } from "react-icons/bs";
import Link from "next/link";

// Certifications Component
const Certifications = () => {
  const images = {
    img1: "/assets/images/Study_Abroad img-1.jpg",
    img2: "/assets/images/Study_Abroad_img-2.jpg",
    img3: "/assets/images/Study-Abroad-img-3.jpg",
    img4: "/assets/images/Study_Abroad_img-4.jpg",
    img6: "/assets/images/Study-Abroad-img-6.jpg",
    img7: "/assets/images/Library.jpg",
  };

  // Updated points list
  const points = [
    "Designed in collaboration with industry experts",
    "Focus on practical, job-ready skills",
    "Hands-on learning through real-world projects",
    "Short-term courses with flexible learning options",
    "Certificates aligned with current industry demands",
    "Ideal for students and working professionals",
  ];

  return (
    <div className="mt-10">
      {/* Banner Section */}
      <div className="w-full bg-gradient-to-b from-[#0f3bfe] via-blue-700 to-[#eaf1ff] text-white text-center pb-0 pt-8">
        <h1 className="text-4xl font-bold mb-4 px-4">
          Upgrade Your Skills With Certificate Courses
        </h1>
        <p className="text-lg px-4 max-w-3xl mx-auto text-gray-100">
          Revolutionizing learning through cutting-edge technology and
          personalized solutions
        </p>

        {/* Centered Image with Rounded Corners and Explore More Button */}
        <div className="flex justify-center mt-10 relative">
          <Image
            src={images.img1}
            alt="Study Abroad"
            width={1200}
            height={600}
            className="mt-10 w-11/12 h-[600px] object-cover rounded-xl shadow-lg -mb-40"
          />
          <Link
            href="/study-abroad"
            className="absolute bottom-4 left-1/2 h-12 w-40 transform -translate-x-1/2 translate-y-40 bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors !no-underline flex items-center justify-center"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="mt-72 px-4 md:px-20 grid md:grid-cols-2 gap-10">
        {/* Left Section */}
        <div className="space-y-6">
          <div className="flex gap-6">
            {/* First Image with rounded bottom corners */}
            <div className="flex-1 relative">
              <div className="h-56 rounded-xl overflow-hidden">
                <Image
                  src={images.img7}
                  alt="Library"
                  width={600}
                  height={224}
                  className="w-full h-full object-cover rounded-t-xl" // Fixed: Added rounded-t-xl
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-sm font-semibold max-w-[200px]">
                    An exceptionally unique experience tailored to you
                  </p>
                </div>
              </div>
            </div>

            {/* Second Image */}
            <div className="w-1/2 relative">
              <Image
                src={images.img2}
                alt="Image 2"
                width={300}
                height={224}
                className="rounded-xl w-full h-56 object-cover"
              />
            </div>
          </div>

          {/* Third Image with proper object position to show face */}
          <div className="relative h-56 rounded-xl overflow-hidden">
            <Image
              src={images.img3}
              alt="Image 3"
              width={600}
              height={260}
              className="w-full h-full object-cover object-[center_30%]" // Fixed: Adjusted object position to show face
              style={{ objectPosition: "center 10%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-2xl font-bold">200+</p>
              <p className="text-sm">
                Aggregates job opportunities from multiple sources
              </p>
            </div>
          </div>
        </div>

        {/* Right Section with updated points */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold">
            A Truly Personalized Learning Journey Designed Just for You
          </h2>
          <ul className="space-y-6">
            {points.map((text, index) => (
              <li key={index} className="flex items-start gap-4 text-gray-700">
                <BsCheck2Circle className="text-blue-600 flex-shrink-0 mt-1 w-6 h-6" />
                <span className="text-lg">{text}</span>
              </li>
            ))}
          </ul>
          <Link href="/study-abroad" className="inline-block">
            <button className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition text-lg font-medium">
              Join Us
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Row of Images - Fixed positioning */}
      <div className="mt-16 grid md:grid-cols-2 gap-6 px-4 md:px-20">
        <div className="relative h-72 rounded-xl overflow-hidden shadow-md">
          <Image
            src={images.img4}
            alt="Study 4"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-72 rounded-xl overflow-hidden shadow-md">
          <Image
            src={images.img6}
            alt="Study 6"
            fill
            className="object-cover object-[center_20%]" // Fixed: Adjusted to show more of the face
            style={{ objectPosition: "center 20%" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const photos = [
    Array.from({ length: 10 }, (_, i) => ({
      src: `https://picsum.photos/id/${i}/200/300`,
    })),
  ];
  const items: React.ReactNode[] = photos[0].map((photo, index) => (
    <Card className="relative overflow-hidden" key={index}>
      <CardContent className="not-prose flex aspect-square items-center justify-center">
        <Image
          src={photo.src}
          alt={index.toString()}
          width={720}
          height={480}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </CardContent>
    </Card>
  ));

  return (
    <Main>
      <Hero />
      <About />
      <MissionVission />
      {/* <ChooseUs /> */}
      {/* <Services /> */}
      {/* <div className="mx-auto">
        <ExamCarousel items={items} />
      </div> */}
      <Certifications />
      <ExpertsTalk />
      <Team />
      <Clients />
    </Main>
  );
}
