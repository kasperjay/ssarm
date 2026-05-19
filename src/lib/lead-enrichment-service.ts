import { fetchInstagramPosts, fetchInstagramProfile } from "@/lib/instagram";
import { fetchSpotifyArtistProfile, fetchSpotifyReleases } from "@/lib/spotify";
import { discoverInstagramHandle, discoverSpotifyArtistId } from "@/lib/google-search";

export interface EnrichmentResult {
  instagramHandle?: string | null;
  spotifyArtistId?: string | null;
  instagramPosts?: any[];
  instagramProfile?: any;
  spotifyProfile?: any;
  spotifyReleases?: any[];
}

export class LeadEnrichmentService {
  async enrich(name: string, payload: {
    instagramHandle?: string | null;
    spotifyArtistId?: string | null;
    skipInstagramFetch?: boolean;
    skipSpotifyFetch?: boolean;
  }): Promise<EnrichmentResult> {
    let instagramHandle = payload.instagramHandle;
    if (!instagramHandle) {
      instagramHandle = await discoverInstagramHandle(name);
    }

    let resolvedSpotifyArtistId = payload.spotifyArtistId;
    if (!resolvedSpotifyArtistId) {
      resolvedSpotifyArtistId = await discoverSpotifyArtistId(name);
    }

    const result: EnrichmentResult = {
      instagramHandle,
      spotifyArtistId: resolvedSpotifyArtistId,
    };

    const skipInstagramFetch = payload.skipInstagramFetch === true;
    const skipSpotifyFetch = payload.skipSpotifyFetch === true;

    if (instagramHandle && !skipInstagramFetch) {
      const [posts, profile] = await Promise.all([
        fetchInstagramPosts(instagramHandle).catch(() => undefined),
        fetchInstagramProfile(instagramHandle).catch(() => null),
      ]);
      result.instagramPosts = posts;
      result.instagramProfile = profile;
    }

    const spotifyReleaseLimit = Number.parseInt(process.env.SPOTIFY_RELEASE_LIMIT ?? "6", 10);
    if (resolvedSpotifyArtistId && !skipSpotifyFetch) {
      const [profile, releases] = await Promise.all([
        fetchSpotifyArtistProfile(resolvedSpotifyArtistId).catch(() => null),
        fetchSpotifyReleases(
          resolvedSpotifyArtistId,
          Number.isFinite(spotifyReleaseLimit) ? spotifyReleaseLimit : 6
        ).catch(() => []),
      ]);
      result.spotifyProfile = profile;
      result.spotifyReleases = releases;
    }

    return result;
  }
}
