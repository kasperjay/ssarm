"use client";

import { useState } from "react";

type Artist = {
  name: string;
  instagramHandle: string | null;
  instagramProfileUrl: string | null;
  instagramProfileImageUrl: string | null;
  followerCount: number | null;
  lastPostAt: Date | null;
  bio: string | null;
  spotifyImageUrl: string | null;
};

type Post = {
  id: string;
  imageUrl: string | null;
  caption: string | null;
  postedAt: Date | null;
  url: string | null;
};

interface Props {
  artist: Artist;
  posts: Post[];
}

const proxiedHelper = (url: string | null) => {
  if (!url) return undefined;
  const CDN_PATTERNS = [
    "fbcdn.net", "instagram.com", "fbsbx.com",
    "cdninstagram.com", "scdn.co", "spotifycdn.com", "spotify.com",
  ];
  if (CDN_PATTERNS.some((p) => url.includes(p))) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const formatRelativeDate = (date: Date | null | undefined) => {
  if (!date) return "Unknown";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) < 7) {
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(diffDays, "day");
  }
  const diffWeeks = Math.round(diffDays / 7);
  if (Math.abs(diffWeeks) < 5) {
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(diffWeeks, "week");
  }
  const diffMonths = Math.round(diffDays / 30);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return formatter.format(diffMonths, "month");
};

export function LeadSocialSection({ artist, posts }: Props) {
  const [postErrors, setPostErrors] = useState<Record<string, boolean>>({});

  // Avatar: prefer IG avatar, fallback to Spotify image
  const avatarUrl = proxiedHelper(artist.instagramProfileImageUrl);
  const avatarFallbackUrl = proxiedHelper(artist.spotifyImageUrl);

  const handlePostImageError = (postId: string) => {
    setPostErrors((prev) => ({ ...prev, [postId]: true }));
  };

  // Bio display
  const rawBio = artist.bio ?? "No telemetry found.";
  const bioMatch = rawBio.match(/^(.+?)\s*\[(Last\.fm|Discogs)\]\s*$/) || rawBio.match(/^(.+?)\s*\((Last\.fm|Discogs)\)\s*$/);
  const bioContent = bioMatch
    ? bioMatch[1].replace(/[\[\]]/g, "").trim()
    : rawBio.trim();
  const attribution = bioMatch ? bioMatch[2] : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,1.2fr)] gap-8">
      {/* Social Details Block */}
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/5 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar — retry cycle: IG → Spotify → placeholder */}
            <div className="h-16 w-16 rounded-full border border-white/10 overflow-hidden relative shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset.retry !== "spotify") {
                      target.dataset.retry = "spotify";
                      target.src = avatarFallbackUrl ?? "";
                    } else {
                      target.style.display = "none";
                    }
                  }}
                />
              ) : null}
              {/* Always show placeholder on top if no image */}
              {!avatarUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight">
                @{artist.instagramHandle || "unknown"}
              </p>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">
                {artist.followerCount?.toLocaleString() || "0"} Followers
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${artist.lastPostAt ? "bg-accent" : "bg-white/20"}`} />
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                {artist.lastPostAt ? formatRelativeDate(artist.lastPostAt) : "No posts"}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <p className="text-sm text-white/70 leading-relaxed font-medium line-clamp-6">
            "{bioContent}"
          </p>
          {attribution && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">
              via {attribution}
            </p>
          )}
        </div>
      </div>

      {/* Posts Carousel */}
      <div className="flex flex-col h-full space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Recent Posts</p>
        <div className="flex-1 w-full relative">
          {posts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory h-full pb-4 scrollbar-none">
              {posts.map((post) => {
                const hasError = postErrors[post.id];
                const postProxySrc = proxiedHelper(post.imageUrl);

                return (
                  <div
                    key={post.id}
                    className="min-w-[260px] w-[260px] snap-center shrink-0 flex flex-col gap-4 p-4 rounded-2xl bg-white/2 border border-white/5"
                  >
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 relative shrink-0">
                      {postProxySrc && !hasError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={postProxySrc}
                          alt="Instagram Post"
                          className="object-cover w-full h-full"
                          onError={() => handlePostImageError(post.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">No Image</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 h-full">
                      <p className="text-xs text-white/80 line-clamp-3 mb-2">
                        "{post.caption}"
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {formatRelativeDate(post.postedAt)}
                        </p>
                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full w-full min-h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-[32px]">
              <p className="text-xs font-bold uppercase text-white/20 tracking-widest">
                No Instagram posts found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
