import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Avoid crashes from @rushstack/eslint-patch on Windows/ESLint 9 during build/dev
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
