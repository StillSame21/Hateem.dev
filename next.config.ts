import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The homepage prerenders statically. We deliberately do not use
  // `output: "export"` because /api/contact needs a server runtime on Vercel.
  reactStrictMode: true,
};

export default nextConfig;
