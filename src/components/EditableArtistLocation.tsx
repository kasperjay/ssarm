"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateArtistLocation } from "@/app/leads/[id]/actions";

interface EditableArtistLocationProps {
  artistId: string;
  initialLocation: string | null;
}

export function EditableArtistLocation({
  artistId,
  initialLocation,
}: EditableArtistLocationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState(initialLocation || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async (overrideValue?: string) => {
    const valueToSave = overrideValue !== undefined ? overrideValue : location;
    const trimmed = valueToSave.trim();

    if (trimmed === (initialLocation || "").trim()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateArtistLocation({ artistId, location: trimmed });
      setLocation(trimmed);
      router.refresh();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update artist location", err);
      setLocation(initialLocation || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setLocation(initialLocation || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 relative z-20">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={location}
            placeholder="e.g. Austin, TX"
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="text-xs font-bold uppercase tracking-[0.2em] text-white bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all min-w-[180px]"
          />
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-lg transition-colors cursor-pointer"
          >
            {isSaving ? "..." : "Save"}
          </button>
          <button
            onClick={() => {
              setLocation(initialLocation || "");
              setIsEditing(false);
            }}
            disabled={isSaving}
            className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/60">
          <span className="uppercase tracking-widest text-white/40">Quick:</span>
          <button
            type="button"
            onClick={() => handleSave("Austin, TX")}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer"
          >
            Austin, TX
          </button>
          <button
            type="button"
            onClick={() => handleSave("San Antonio, TX")}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer"
          >
            San Antonio
          </button>
          <button
            type="button"
            onClick={() => handleSave("Houston, TX")}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer"
          >
            Houston
          </button>
          <button
            type="button"
            onClick={() => handleSave("Dallas, TX")}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer"
          >
            Dallas
          </button>
        </div>
      </div>
    );
  }

  const isAustin =
    location.toLowerCase().includes("austin") ||
    location.toLowerCase().includes("atx");

  return (
    <div className="group/loc flex items-center gap-1.5 relative cursor-pointer" onClick={() => setIsEditing(true)}>
      <span className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isAustin ? "text-accent" : "text-white/40"}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className={location ? (isAustin ? "text-accent font-semibold" : "text-white/80") : "text-amber-400/80 italic font-normal"}>
          {location || "Set location"}
        </span>
      </span>
      <button
        type="button"
        className="opacity-0 group-hover/loc:opacity-100 transition-opacity p-0.5 text-white/40 hover:text-accent rounded"
        title="Edit Location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
    </div>
  );
}
