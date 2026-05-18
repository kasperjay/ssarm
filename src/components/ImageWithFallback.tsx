"use client";

import { useState } from "react";

interface Props {
  src: string;
  srcFallback: string;
  alt: string;
  className?: string;
  fallbackIcon?: "user" | "image" | "play";
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  srcFallback,
  alt,
  className = "",
  fallbackIcon = "image",
  containerClassName = "",
}: Props) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className={containerClassName}>
      {useFallback ? (
        <div className=" ">
          {fallbackIcon === "user" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          )}
          {fallbackIcon === "image" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
          )}
          {fallbackIcon === "play" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
          )}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          onError={() => setUseFallback(true)}
        />
      )}
    </div>
  );
}
