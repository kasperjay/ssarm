"use client";

import { useState, useRef, useEffect } from "react";
import { updateArtistName } from "@/app/leads/[id]/actions";

interface EditableArtistNameProps {
  artistId: string;
  initialName: string;
}

export function EditableArtistName({ artistId, initialName }: EditableArtistNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!name.trim() || name.trim() === initialName) {
      setName(initialName);
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateArtistName({ artistId, name: name.trim() });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update artist name", err);
      // Revert on failure just in case
      setName(initialName);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(initialName);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4 w-full">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isSaving}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none capitalize bg-black/20 border border-white/20 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
        {isSaving && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 relative w-full md:w-fit">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight md:leading-none capitalize">
        {name}
      </h1>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white"
        title="Edit Artist Name"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
    </div>
  );
}
