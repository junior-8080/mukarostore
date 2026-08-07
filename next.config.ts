import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      // Cloudflare R2 default public bucket domain (pub-<hash>.r2.dev)
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // R2 custom domain
      {
        protocol: "https",
        hostname: "media.dasandacloset.com",
      },
    ],
  },
};

export default nextConfig;
