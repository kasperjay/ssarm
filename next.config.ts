import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn.spotifycdn.com",
      },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "cdninstagram.com" },
      { protocol: "https", hostname: "scontent.xx.fbcdn.net" },
      { protocol: "https", hostname: "fbcdn.net" },
    ],
    unoptimized: true,
  },
  serverExternalPackages: ["@prisma/client", "apify-client", "local-prisma-client"],
  async redirects() {
    return [
      {
        source: "/drafts",
        destination: "/leads",
        permanent: true,
      },
      {
        source: "/leads/drafts",
        destination: "/leads",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
