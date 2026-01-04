import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Changed from "unsplash.com"
        port: "",
        pathname: "/**", // Use /** to allow all paths
      },
      {
        protocol: "https",
        hostname: "unsplash.com", // Keep this if you might use other unsplash subdomains
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "/dms/image/v2/**",
      },
      {
        protocol: "https",
        hostname: "project-0.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
  },
};

export default nextConfig;
