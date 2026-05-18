import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Spotify
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
      // Instagram
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "scontent.xx.fbcdn.net" },
      { protocol: "https", hostname: "scontent.com" },
      { protocol: "https", hostname: "cdninstagram.com" },
      { protocol: "https", hostname: "fbcdn.net" },
      // Instagram profile images
      { protocol: "https", hostname: "**.instagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      // Unsplash (for demo/test data)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Allow wildcard for external image sources (careful: only for trusted URLs)
      { protocol: "https", hostname: "**.cdninstagram.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
