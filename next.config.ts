import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
