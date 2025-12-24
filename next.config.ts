import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        // Allow all paths from picsum.photos (e.g. /id/0/200/300)
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
        pathname: "/**"
      }
    ],
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
    ],
  },
  experimental: {
      serverActions: {
          bodySizeLimit: '1000mb',
      }
  },
};

export default nextConfig;
