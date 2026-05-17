import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://myanimelist.net/images/anime/*/*.webp")],
  },
};

export default nextConfig;
