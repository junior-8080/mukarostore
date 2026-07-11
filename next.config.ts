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
      // Cloudflare R2 default public bucket domain (pub-<hash>.r2.dev)
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // R2 custom domain — update hostname to match your domain if configured
      {
        protocol: "https",
        hostname: "media.dasandacloset.com",
      },
    ],
  },
};

export default nextConfig;