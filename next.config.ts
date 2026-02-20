import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
