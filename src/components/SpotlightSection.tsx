"use client";

import { useState } from "react";
import { getRandomLead } from "@/app/actions";
import { formatRelativeDate, formatLocation } from "@/lib/utils";

interface SpotlightSectionProps {
  initialLead: any;
}

export function SpotlightSection({ initialLead }: SpotlightSectionProps) {
  const [lead, setLead] = useState(initialLead);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newLead = await getRandomLead();
      if (newLead) {
        setLead(newLead);
      }
    } catch (error) {
      console.error("Failed to refresh spotlight:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!lead) {
    return (
      <section className="flex flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-(--surface-strong) p-6">
          <h2 className="text-xl font-semibold text-foreground">Spotlight Lead</h2>
          <p className="text-sm text-(--muted)">No leads available.</p>
        </div>
      </section>
    );
  }

  const spotlightRelease = lead.artist.releases[0];
  const spotlightCaption =
    lead.artist.instagramPosts[0]?.caption ??
    lead.artist.bio ??
    "No recent post data yet.";

  const messageCount = lead.messages.length;
  const messages = messageCount
    ? lead.messages.map((m: any) => ({
        id: m.id,
        tone: m.tone ?? "Draft",
        body: m.body,
      }))
    : [
        {
          id: "empty",
          tone: "Draft",
          body: "No outreach drafts yet. Run the LLM generator to create personalized intros.",
        },
      ];

  return (
    <section className="flex flex-col gap-6">
      <div className="relative rounded-3xl border border-white/10 bg-(--surface-strong) p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-foreground">Spotlight Lead</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${loading ? "animate-spin" : ""}`}
            title="Refresh Spotlight"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--muted) hover:text-foreground transition-colors"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-(--muted)">
          {`${lead.artist.name} · ${lead.artist.genre ?? "Unknown"} · ${formatLocation(
            lead.artist.location,
            lead.artist.city,
            lead.artist.state,
            lead.artist.country
          )}`}
        </p>
        <div className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-(--surface) p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-(--muted)">Latest release</span>
            <span className="font-semibold text-foreground text-right ml-2">
              {spotlightRelease
                ? `${spotlightRelease.title} - ${formatRelativeDate(
                    spotlightRelease.releaseDate ?? spotlightRelease.createdAt
                  )}`
                : "No release data"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-(--muted)">Instagram activity</span>
            <span className="font-semibold text-foreground text-right ml-2">
              {lead.artist.lastPostAt
                ? `Last post ${formatRelativeDate(lead.artist.lastPostAt)}`
                : "No recent post"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-(--muted)">Followers</span>
            <span className="font-semibold text-foreground text-right ml-2">
              {lead.artist.followerCount?.toLocaleString() ?? "Unknown"}
            </span>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground">
          {spotlightCaption}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-(--surface-strong) p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Outreach Drafts</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-(--muted)">
            {messageCount} drafts
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className="rounded-2xl border border-white/10 bg-(--surface) p-4"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-(--muted)">
                {message.tone}
              </p>
              <p className="mt-2 text-sm text-foreground">
                {message.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full bg-(--accent) px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-(--accent-strong)">
                  Use Draft
                </button>
                <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-(--muted) transition hover:border-(--accent) hover:text-(--accent-strong)">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
