import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/google-search", () => ({
  discoverInstagramHandle: vi.fn(),
  discoverSpotifyArtistId: vi.fn(),
}));

vi.mock("@/lib/instagram", () => ({
  fetchInstagramPosts: vi.fn(),
  fetchInstagramProfile: vi.fn(),
}));

vi.mock("@/lib/spotify", () => ({
  fetchSpotifyArtistProfile: vi.fn(),
  fetchSpotifyReleases: vi.fn(),
}));

import { LeadEnrichmentService } from "@/lib/lead-enrichment-service";
import { discoverInstagramHandle, discoverSpotifyArtistId } from "@/lib/google-search";
import { fetchInstagramPosts, fetchInstagramProfile } from "@/lib/instagram";
import { fetchSpotifyArtistProfile, fetchSpotifyReleases } from "@/lib/spotify";

describe("LeadEnrichmentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("avoids Apify discovery and Instagram fetches for venue-calendar imports", async () => {
    const result = await new LeadEnrichmentService().enrich("Live Artist", {
      skipApifyDiscovery: true,
      skipInstagramFetch: true,
    });

    expect(discoverInstagramHandle).not.toHaveBeenCalled();
    expect(discoverSpotifyArtistId).not.toHaveBeenCalled();
    expect(fetchInstagramPosts).not.toHaveBeenCalled();
    expect(fetchInstagramProfile).not.toHaveBeenCalled();
    expect(fetchSpotifyArtistProfile).not.toHaveBeenCalled();
    expect(fetchSpotifyReleases).not.toHaveBeenCalled();
    expect(result.instagramHandle).toBeUndefined();
    expect(result.spotifyArtistId).toBeUndefined();
  });
});
