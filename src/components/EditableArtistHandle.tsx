"use client";

import { useState, useRef, useEffect } from "react";
import { updateArtistHandle } from "@/app/leads/[id]/actions";

interface EditableArtistHandleProps {
  leadId: string;
  initialHandle: string | null;
}

export function EditableArtistHandle({ leadId, initialHandle }: EditableArtistHandleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [handle, setHandle] = useState(initialHandle || "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const normalized = handle.trim().replace("@", "");
    const initialNormalized = initialHandle?.replace("@", "") || "";

    if (!normalized || normalized === initialNormalized) {
      setHandle(initialHandle || "");
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateArtistHandle({ leadId, instagramHandle: normalized });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update artist handle", err);
      // Revert on failure
      setHandle(initialHandle || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setHandle(initialHandle || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full max-w-[240px]">
        <div className="text-white/40 text-lg font-bold">@</div>
        <input
          ref={inputRef}
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isSaving}
          className="text-lg font-bold tracking-tight text-white bg-white/5 border border-white/20 rounded-xl px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
        {isSaving && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent shrink-0" />
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 relative w-fit">
      <p className="text-lg md:text-xl font-bold text-white tracking-tight">
        @{handle || "unknown"}
      </p>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"
        title="Edit Instagram Handle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
    </div>
  );
}
