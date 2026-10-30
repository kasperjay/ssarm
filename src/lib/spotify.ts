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

type SpotifyWebArtist = {
  profile?: {
    name?: string;
  };
  discography?: {
    albums?: { items?: SpotifyWebReleaseGroup[] };
    singles?: { items?: SpotifyWebReleaseGroup[] };
  };
  visuals?: {
    avatarImage?: { sources?: Array<{ url?: string }> };
  };
};

type SpotifyWebReleaseGroup = {
  releases?: {
    items?: SpotifyWebRelease[];
  };
};

type SpotifyWebRelease = {
  name?: string;
  type?: string;
  date?: { year?: number; month?: number; day?: number };
  uri?: string;
  coverArt?: { sources?: Array<{ url?: string }> };
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

const fetchSpotifyWebArtist = async (spotifyArtistId: string): Promise<SpotifyWebArtist | null> => {
  const url = `https://open.spotify.com/artist/${spotifyArtistId}`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<script[^>]*id="initialState"[^>]*>([\s\S]*?)<\/script>/);
    if (!match?.[1]) return null;
    return JSON.parse(Buffer.from(match[1], "base64").toString("utf8"))
      ?.entities?.items?.[`spotify:artist:${spotifyArtistId}`] ?? null;
  } catch {
    return null;
  }
};

const fetchSpotifyOEmbed = async (spotifyArtistId: string) => {
  try {
    const target = `https://open.spotify.com/artist/${spotifyArtistId}`;
    const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(target)}`);
    if (!response.ok) return null;
    return (await response.json()) as { title?: string; thumbnail_url?: string };
  } catch {
    return null;
  }
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
  if (!data) {
    const [webArtist, oembed] = await Promise.all([
      fetchSpotifyWebArtist(spotifyArtistId),
      fetchSpotifyOEmbed(spotifyArtistId),
    ]);
    if (!webArtist && !oembed) return null;
    return {
      name: webArtist?.profile?.name ?? oembed?.title,
      url: `https://open.spotify.com/artist/${spotifyArtistId}`,
      imageUrl:
        webArtist?.visuals?.avatarImage?.sources?.[0]?.url ?? oembed?.thumbnail_url,
    };
  }

  const images = Array.isArray(data.images) ? data.images : [];
  const imageUrl =
    images[0] && typeof images[0].url === "string" ? images[0].url : undefined;
  const genres = Array.isArray(data.genres) ? data.genres.filter(Boolean) : [];
  const url =
    data.external_urls &&
    typeof (data.external_urls as Record<string, unknown>).spotify === "string"
      ? ((data.external_urls as Record<string, unknown>).spotify as string)
      : undefined;

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
  let path: string | null = `artists/${spotifyArtistId}/albums?${new URLSearchParams({
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
          typeof item.album_type === "string" ? (item.album_type as string) : undefined,
      });
    }

    const nextUrl =
      typeof data.next === "string" && data.next.startsWith("https://api.spotify.com/v1/")
        ? data.next.replace("https://api.spotify.com/v1/", "")
        : null;
    path = releases.length < target ? nextUrl : null;
  }

  if (releases.length > 0) return releases;

  const artist = await fetchSpotifyWebArtist(spotifyArtistId);
  const groups = [
    ...(artist?.discography?.albums?.items ?? []),
    ...(artist?.discography?.singles?.items ?? []),
  ];
  const fallbackReleases: SpotifyRelease[] = [];
  const seenFallback = new Set<string>();

  for (const group of groups) {
    const release = group.releases?.items?.[0];
    const id = release?.uri?.match(/^spotify:album:(.+)$/)?.[1];
    if (!release || !id || seenFallback.has(id)) continue;
    seenFallback.add(id);
    const date = release.date;
    const releaseDate = date?.year
      ? new Date(Date.UTC(date.year, (date.month ?? 1) - 1, date.day ?? 1)).toISOString()
      : null;
    fallbackReleases.push({
      spotifyReleaseId: id,
      title: release.name ?? "Untitled",
      releaseDate,
      imageUrl: release.coverArt?.sources?.[0]?.url ?? null,
      url: `https://open.spotify.com/album/${id}`,
      releaseType: release.type?.toLowerCase() ?? null,
    });
    if (fallbackReleases.length >= target) break;
  }

  return fallbackReleases;
};
