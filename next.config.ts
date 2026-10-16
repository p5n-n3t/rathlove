import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Extra dev hosts (comma-separated), e.g. a preview proxy domain.
  allowedDevOrigins: process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",") ?? [],
  reactStrictMode: true,
};

export default nextConfig;
