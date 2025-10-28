import type { NextConfig } from "next";
import { withWorkflow } from 'workflow/next'; 

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

export default withWorkflow(nextConfig);
