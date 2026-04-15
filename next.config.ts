import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.epinpay.com",
      },
    ],
  },
};

export default nextConfig;
