import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "praytogether.up.railway.app",
        pathname: "/**",
      },{
        protocol: "https",
        hostname: "pray.up.railway.app",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;