type SpotifyToken = {
  accessToken: string;
  expiresAt: number;
};

type SpotifyArtistProfile = {
  name?: string;
  url?: string;
  imageUrl?: string | null;
  genres?: string[];
};

export type SpotifyRelease = {
  spotifyReleaseId: string;
  title: string;
  releaseDate?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  releaseType?: string | null;
};

let tokenCache: SpotifyToken | null = null;

const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) return null;
  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) return null;

  const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 3600;
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + expiresIn * 1000,
  };

  return data.access_token;
};

const spotifyFetch = async (path: string) => {
  const token = await getAccessToken();
  if (!token) return null;
  const response = await fetch(`https://api.spotify.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json() as Promise<Record<string, unknown>>;
};

const parseReleaseDate = (value?: string, precision?: string) => {
  if (!value) return null;
  if (precision === "day") return new Date(value).toISOString();
  if (precision === "month") return new Date(`${value}-01`).toISOString();
  if (precision === "year") return new Date(`${value}-01-01`).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const fetchSpotifyArtistProfile = async (
  spotifyArtistId: string
): Promise<SpotifyArtistProfile | null> => {
  const data = await spotifyFetch(`artists/${spotifyArtistId}`);
  if (!data) return null;

  const images = Array.isArray(data.images) ? data.images : [];
  const imageUrl =
    images[0] && typeof images[0].url === "string" ? images[0].url : null;
  const genres = Array.isArray(data.genres) ? data.genres.filter(Boolean) : [];
  const url =
    data.external_urls &&
    typeof (data.external_urls as Record<string, unknown>).spotify === "string"
      ? ((data.external_urls as Record<string, unknown>).spotify as string)
      : null;

  return {
    name: typeof data.name === "string" ? data.name : undefined,
    url,
    imageUrl,
    genres: genres.length ? (genres as string[]) : undefined,
  };
};

export const fetchSpotifyReleases = async (
  spotifyArtistId: string,
  limit = 6
): Promise<SpotifyRelease[]> => {
  const target = Math.max(1, limit);
  const pageSize = Math.min(50, Math.max(target * 2, target + 4));
  let path = `artists/${spotifyArtistId}/albums?${new URLSearchParams({
    include_groups: "album,single",
    limit: String(pageSize),
    market: "US",
  })}`;

  const seen = new Set<string>();
  const releases: SpotifyRelease[] = [];

  while (path && releases.length < target) {
    const data = await spotifyFetch(path);
    if (!data || !Array.isArray(data.items)) break;

    for (const item of data.items as Array<Record<string, unknown>>) {
      if (releases.length >= target) break;
      const id = typeof item.id === "string" ? item.id : null;
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const images = Array.isArray(item.images) ? item.images : [];
      const imageUrl =
        images[0] && typeof images[0].url === "string" ? images[0].url : null;
      const url =
        item.external_urls &&
        typeof (item.external_urls as Record<string, unknown>).spotify === "string"
          ? ((item.external_urls as Record<string, unknown>).spotify as string)
          : null;

      releases.push({
        spotifyReleaseId: id,
        title: typeof item.name === "string" ? item.name : "Untitled",
        releaseDate: parseReleaseDate(
          typeof item.release_date === "string" ? item.release_date : undefined,
          typeof item.release_date_precision === "string"
            ? item.release_date_precision
            : undefined
        ),
        imageUrl,
        url,
        releaseType:
          typeof item.album_type === "string" ? (item.album_type as string) : null,
      });
    }

    const nextUrl =
      typeof data.next === "string" && data.next.startsWith("https://api.spotify.com/v1/")
        ? data.next.replace("https://api.spotify.com/v1/", "")
        : null;
    path = releases.length < target ? nextUrl : null;
  }

  return releases;
};
