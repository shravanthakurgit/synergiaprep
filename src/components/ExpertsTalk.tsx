import Image from "next/image";
import Link from "next/link";

const ExpertsTalk = () => {
  const image = "/assets/images/Global expert.jpeg";

  return (
    <div className="relative flex flex-col md:flex-row items-start justify-between py-16 md:py-24 px-4 md:px-20">
      {/* Blue Background + Text */}
      <div className="relative w-full bg-blue-100 space-y-6 px-6 sm:mt-[8.5rem] py-8 rounded-xl z-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          <div>Global Experts,</div>
          <div>Personalized Support</div>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg">
          Our team is here to help you navigate every aspect of studying abroad.
        </p>

        <div>
          <Link href="/study-abroad" className="inline-block">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Let&apos;s Talk
            </button>
          </Link>
        </div>
      </div>

      {/* Overlapping Image */}
      <div className="relative md:absolute md:right-40 md:-translate-y-1/2 z-30 mt-6 md:mt-[0.5rem] md:top-1/2 flex justify-center w-full md:w-auto">
        <Image
          src={image}
          alt="Global expert"
          width={400}
          height={480}
          className="w-72 sm:w-80 h-auto rounded-lg shadow-lg object-cover"
        />
      </div>
    </div>
  );
};

export default ExpertsTalk;
