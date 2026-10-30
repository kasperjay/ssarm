"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const campaignTypes = [
  { value: "NEW_RELEASES", label: "New Releases" },
  { value: "VENUE_BOOKING", label: "Venue Booking" },
  { value: "COLLABORATION", label: "Collaboration" },
  { value: "REENGAGEMENT", label: "Re-engagement" },
  { value: "RECRUITMENT", label: "Recruitment" },
  { value: "PORTFOLIO_BUILDING", label: "Portfolio Building" }
];

const channels = [
  { value: "EMAIL", label: "Email" },
  { value: "INSTAGRAM_DM", label: "Instagram DM" },
  { value: "PHONE", label: "Phone" },
  { value: "IN_PERSON", label: "In Person" },
  { value: "OTHER", label: "Other" }
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "NEW_RELEASES",
    channel: "EMAIL",
    targetCount: 50,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "ACTIVE"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/KPIs/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate),
          targetCount: parseInt(formData.targetCount.toString())
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/KPIs/campaigns/${data.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to create campaign"}`);
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
      <div className="relative mx-auto flex max-w-4xl flex-col gap-16 px-6">
        {/* Header */}
        <header className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-12 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
              >
                ← Back
              </button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-accent/40" />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">
                    Campaign Creation
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight premium-gradient-text pr-4">
                  New Campaign
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campaign Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2 block">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Summer Tour Outreach 2026"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-lg font-bold text-white placeholder:text-white/25 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                required
              />
            </div>

            {/* Type and Channel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Campaign Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3 block">
                  Type
                </label>
                <div className="space-y-2">
                  {campaignTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className="w-5 h-5 accent-accent"
                      />
                      <span className="text-sm font-bold text-white">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Outreach Channel */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3 block">
                  Channel
                </label>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <label key={channel.value} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="channel"
                        value={channel.value}
                        checked={formData.channel === channel.value}
                        onChange={handleChange}
                        className="w-5 h-5 accent-accent"
                      />
                      <span className="text-sm font-bold text-white">{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Count */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2 block">
                Target Count
              </label>
              <input
                type="number"
                name="targetCount"
                value={formData.targetCount}
                onChange={handleChange}
                min="1"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-lg font-bold text-white focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2 block">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-lg font-bold text-white focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/30 mb-2 block">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                  min={formData.startDate}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-lg font-bold text-white focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white transition-all"
              >
                Cancel
              </button>
              <NeonButton type="submit" variant="lime" size="lg" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Campaign"}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}