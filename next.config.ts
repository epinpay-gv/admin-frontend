import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.epinpay.com",
      },
    ],
  },
};

export default nextConfig;
