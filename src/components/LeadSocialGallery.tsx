"use client";

import { useState } from "react";

type Post = {
  id: string;
  imageUrl: string | null;
  caption: string | null;
  postedAt: Date | null;
  url: string | null;
};

interface Props {
  avatarSrc: string | null;
  avatarFallbackSrc: string | null;
  posts: Post[];
}

export function LeadSocialGallery({ avatarSrc, avatarFallbackSrc, posts }: Props) {
  const [avatarError, setAvatarError] = useState(false);
  const [postErrors, setPostErrors] = useState<Record<string, boolean>>({});

  const avatarSrcFinal = avatarError ? (avatarFallbackSrc ?? null) : avatarSrc;
  const showAvatarFallback = !avatarSrcFinal;

  return (
    <>
      {/* Avatar */}
      {showAvatarFallback ? (
        <div className="h-16 w-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      ) : avatarSrcFinal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrcFinal}
          alt="Avatar"
          className="object-cover w-full h-full"
          onError={() => {
            if (!avatarError) setAvatarError(true);
          }}
        />
      ) : null}

      {/* Posts carousel */}
      {posts.map((post) => {
        const hasError = postErrors[post.id];
        const hasImage = post.imageUrl && !hasError;

        if (!hasImage) {
          return (
            <div key={post.id} className="w-full aspect-square rounded-2xl bg-white/5 flex items-center justify-center">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">No Image</p>
            </div>
          );
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={post.id}
            src={post.imageUrl!}
            alt="Instagram Post"
            className="object-cover w-full h-full"
            onError={() => {
              setPostErrors((prev) => ({ ...prev, [post.id]: true }));
            }}
          />
        );
      })}
    </>
  );
}
