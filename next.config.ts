import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.alwalijewellers.com",
      },
    ],
  },
};

export default nextConfig;
