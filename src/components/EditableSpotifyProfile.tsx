"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateArtistSpotifyProfile } from "@/app/leads/[id]/actions";

interface EditableSpotifyProfileProps {
  artistId: string;
  leadId: string;
  /** Current artist name pulled from Spotify, e.g. "Rocky Mizell" */
  spotifyName: string | null;
  /** Current Spotify artist URL, e.g. "https://open.spotify.com/artist/..." */
  spotifyUrl: string | null;
}

export function EditableSpotifyProfile({
  artistId,
  leadId,
  spotifyName,
  spotifyUrl,
}: EditableSpotifyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!input.trim()) {
      setIsEditing(false);
      setError(null);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await updateArtistSpotifyProfile({
        artistId,
        leadId,
        spotifyInput: input.trim(),
      });

      if (result.ok) {
        setIsEditing(false);
        setInput("");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } catch {
      setError("Failed to update Spotify profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInput("");
      setError(null);
    }
  };

  const handleOpen = () => {
    setInput(spotifyUrl ?? "");
    setError(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80">
          Correct Spotify Artist
        </p>
        <p className="text-[11px] text-white/40">
          Paste the correct Spotify artist URL or ID. This replaces the linked Spotify releases for this artist.
        </p>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            placeholder="Paste Spotify artist URL or ID…"
            className="flex-1 min-w-0 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="shrink-0 px-3 py-2 rounded-xl bg-accent/20 border border-accent/30 text-xs font-bold text-accent hover:bg-accent/30 disabled:opacity-40 transition-all"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => { setIsEditing(false); setInput(""); setError(null); }}
            disabled={isSaving}
            className="shrink-0 px-3 py-2 rounded-xl border border-white/10 bg-white/3 text-xs font-bold text-white/40 hover:text-white hover:border-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
        {error && (
          <p className="text-[10px] text-red-400/80 font-medium">{error}</p>
        )}
        {isSaving && (
          <p className="text-[10px] text-white/40 animate-pulse">
            Fetching Spotify profile & releases…
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="group/spotify flex items-center gap-2 mt-2">
      {spotifyUrl ? (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-white/50 hover:text-accent transition-colors truncate"
        >
          {spotifyName ?? "Open on Spotify"}
        </a>
      ) : (
        <span className="text-[11px] text-white/30 italic">No Spotify artist linked</span>
      )}
      <button
        type="button"
        onClick={handleOpen}
        title="Correct Spotify artist"
        className="shrink-0 rounded-lg border border-amber-400/20 bg-amber-400/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300/80 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-200"
      >
        Change
      </button>
    </div>
  );
}
