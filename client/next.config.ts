import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icepickbucket.s3.sa-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
