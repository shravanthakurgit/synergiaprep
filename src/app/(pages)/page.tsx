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
            <div
              className="flex-1 h-56 bg-cover bg-center rounded-xl p-4 text-white flex flex-col justify-end"
              style={{ backgroundImage: `url(${images.img7})` }}
            >
              <ul className="space-y-1 text-sm font-semibold">
                <li className="text-2xl">100+</li>
                <li>An exceptionally unique experience tailored to you</li>
              </ul>
            </div>
            <Image
              src={images.img2}
              alt="Image 2"
              width={300}
              height={224}
              className="rounded-xl w-1/2 object-cover"
            />
          </div>

          <div
            className="h-56 bg-cover bg-[center_bottom_90%] rounded-xl p-4 text-white flex flex-col justify-end"
            style={{ backgroundImage: `url(${images.img3})` }}
          >
            <div>
              <p className="text-2xl font-bold">200+</p>
              <p>Aggregates job opportunities from multiple sources</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold">
            A Truly Personalized Learning Journey Designed Just for You
          </h2>
          <ul className="space-y-8 text-3xl">
            {[
              "Undergraduate Programs",
              "Postgraduate and Master's programs",
              "PhD and Research Programs",
              "Language Programs",
              "Foundation and Pathway Programs",
            ].map((text, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700">
                <BsCheck2Circle className="text-blue-600" />
                {text}
              </li>
            ))}
          </ul>
          <Link href="/study-abroad" className="inline-block">
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
              Join Us
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Row of Images */}
      <div className="mt-16 grid md:grid-cols-2 gap-6 px-4 md:px-20">
        <Image
          src={images.img4}
          alt="Study 4"
          width={600}
          height={288}
          className="h-72 w-full rounded-xl shadow-md object-cover"
        />
        <Image
          src={images.img6}
          alt="Study 6"
          width={600}
          height={288}
          className="h-72 w-full rounded-xl shadow-md object-cover object-[center_10%]"
        />
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
      <ChooseUs />
      <Services />
      <div className="mx-auto">
        <ExamCarousel items={items} />
      </div>
      <Certifications />
      <ExpertsTalk />
      <Team />
      <Clients />
    </Main>
  );
}
