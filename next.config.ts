import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
