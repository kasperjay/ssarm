import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { discoverEmailsFromUrls, extractEmailsFromTextSafe, mergeEmails } from "@/lib/email";
import { resolveArtistEnrichment } from "@/lib/location";
import { scoreLead } from "@/lib/scoring";
import { cleanArtistName } from "@/lib/utils";
import { extractAccentFromImage } from "@/lib/accent-palette";
import { LeadEnrichmentService, EnrichmentResult } from "@/lib/lead-enrichment-service";

export type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "WON"
  | "LOST";

export type ActivityType =
  | "MESSAGE_SENT"
  | "REPLY_RECEIVED"
  | "FOLLOW_UP_SET"
  | "STATUS_CHANGE"
  | "NOTE";

export type LeadPayload = {
  isDiscoveryImport?: boolean;
  skipInstagramFetch?: boolean;
  skipSpotifyFetch?: boolean;
  artist: {
    name: string;
    instagramHandle?: string | null;
    instagramProfileUrl?: string | null;
    instagramProfileImageUrl?: string | null;
    spotifyArtistId?: string | null;
    spotifyArtistUrl?: string | null;
    spotifyImageUrl?: string | null;
    spotifyAccent?: string | null;
    spotifyAccentStrong?: string | null;
    spotifyHighlight?: string | null;
    officialSiteUrl?: string | null;
    location?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    genre?: string | null;
    tags?: string[] | null;
    bio?: string | null;
    emails?: string[] | null;
    followerCount?: number | null;
    lastPostAt?: string | null;
  };
  lead?: {
    id?: string;
    status?: LeadStatus;
    score?: number | null;
    scoreRationale?: string | null;
    lastContactedAt?: string | null;
    nextActionAt?: string | null;
  };
  releases?: Array<{
    spotifyTrackId?: string | null;
    spotifyReleaseId?: string | null;
    title: string;
    releaseDate?: string | null;
    imageUrl?: string | null;
    url?: string | null;
    releaseType?: string | null;
  }>;
  instagramPosts?: Array<{
    instagramPostId?: string | null;
    caption?: string | null;
    imageUrl?: string | null;
    postedAt?: string | null;
    url?: string | null;
  }>;
  messageDrafts?: Array<{
    tone?: string | null;
    body: string;
    source?: string | null;
    selected?: boolean | null;
  }>;
  activities?: Array<{
    type: ActivityType;
    note?: string | null;
    occurredAt?: string | null;
  }>;
};

interface IngestContext {
  enrichment: EnrichmentResult;
}

export class LeadIngestService {
  private enrichmentService = new LeadEnrichmentService();

  async ingestLead(payload: LeadPayload): Promise<{ artistId: string; leadId: string }> {
    const name = cleanArtistName(payload.artist.name);
    if (!name) {
      throw new Error("artist.name is missing or invalid after cleaning");
    }

    try {
      logger.info(`[LeadIngestService] Starting ingestion for artist: ${name}`);

      const enrichment = await this.enrichmentService.enrich(name, {
        instagramHandle: payload.artist.instagramHandle,
        spotifyArtistId: payload.artist.spotifyArtistId,
        skipInstagramFetch: payload.skipInstagramFetch,
        skipSpotifyFetch: payload.skipSpotifyFetch,
      });

      const context: IngestContext = { enrichment };
      const artist = await this.resolveArtist(name, payload, context);
      const lead = await this.resolveLead(artist, payload);

      await Promise.all([
        this.processReleases(artist, payload, context).catch(e => logger.error(`[LeadIngestService] Failed to process releases for ${name}:`, e)),
        this.processInstagramPosts(artist, payload, context).catch(e => logger.error(`[LeadIngestService] Failed to process IG posts for ${name}:`, e)),
        this.processMessageDrafts(lead, payload).catch(e => logger.error(`[LeadIngestService] Failed to process drafts for ${name}:`, e)),
        this.processActivities(lead, payload).catch(e => logger.error(`[LeadIngestService] Failed to process activities for ${name}:`, e)),
      ]);

      await scoreLead(lead.id);
      logger.info(`[LeadIngestService] Successfully ingested artist: ${name} (ArtistID: ${artist.id}, LeadID: ${lead.id})`);

      return {
        artistId: artist.id,
        leadId: lead.id,
      };
    } catch (error: any) {
      logger.error(`[LeadIngestService] Critical failure during ingestion for ${name}:`, error);
      throw error;
    }
  }

  private async resolveArtist(name: string, payload: LeadPayload, context: IngestContext) {
    const { enrichment } = context;
    const {
      instagramProfileUrl,
      instagramProfileImageUrl,
      spotifyArtistUrl,
      spotifyImageUrl,
      spotifyAccent,
      spotifyAccentStrong,
      spotifyHighlight,
      officialSiteUrl,
      location,
      city,
      state,
      country,
      genre,
      tags,
      bio,
      emails,
      followerCount,
      lastPostAt,
    } = payload.artist;

    const instagramHandle = enrichment.instagramHandle;
    const resolvedSpotifyArtistId = enrichment.spotifyArtistId;

    const artistMatchers = [] as Array<Record<string, unknown>>;
    if (instagramHandle) artistMatchers.push({ instagramHandle });
    if (resolvedSpotifyArtistId) artistMatchers.push({ spotifyArtistId: resolvedSpotifyArtistId });
    artistMatchers.push({ name, city: city ?? undefined, state: state ?? undefined });

    const existingArtist = await prisma.artist.findFirst({
      where: { OR: artistMatchers },
      include: { leads: true }
    });

    const resolvedSpotifyArtistUrl = spotifyArtistUrl ?? enrichment.scrapedSpotifyProfile?.url ?? existingArtist?.spotifyArtistUrl ?? null;
    const resolvedSpotifyImageUrl = spotifyImageUrl ??
      existingArtist?.spotifyImageUrl ??
      enrichment.scrapedSpotifyProfile?.imageUrl ??
      (await this.fetchSpotifyImageUrl(resolvedSpotifyArtistUrl, resolvedSpotifyArtistId));
    
    const computedAccent = resolvedSpotifyImageUrl 
      ? await extractAccentFromImage(resolvedSpotifyImageUrl) 
      : null;

    const igProfileUrl = enrichment.scrapedInstagramProfile?.profileImageUrl ?? existingArtist?.instagramProfileImageUrl;
    const igAccent = !computedAccent && igProfileUrl 
      ? await extractAccentFromImage(igProfileUrl) 
      : null;

    const resolvedSpotifyAccent = spotifyAccent ?? computedAccent?.accent ?? igAccent?.accent ?? existingArtist?.spotifyAccent ?? null;
    const resolvedSpotifyAccentStrong = spotifyAccentStrong ?? computedAccent?.accentStrong ?? igAccent?.accentStrong ?? existingArtist?.spotifyAccentStrong ?? resolvedSpotifyAccent;
    const resolvedSpotifyHighlight = spotifyHighlight ?? computedAccent?.highlight ?? igAccent?.highlight ?? existingArtist?.spotifyHighlight ?? resolvedSpotifyAccent;
    
    const derivedEmails = extractEmailsFromTextSafe(
      bio ?? enrichment.scrapedInstagramProfile?.bio ?? existingArtist?.bio ?? null
    );
    const resolvedEmails = mergeEmails(
      existingArtist?.emails,
      emails ?? undefined,
      derivedEmails,
      enrichment.scrapedInstagramProfile?.businessEmail ? [enrichment.scrapedInstagramProfile.businessEmail] : undefined
    );
    const resolvedOfficialSiteUrl = officialSiteUrl ?? enrichment.scrapedInstagramProfile?.externalUrl ?? existingArtist?.officialSiteUrl ?? null;
    const resolvedInstagramProfileImageUrl = instagramProfileImageUrl ?? enrichment.scrapedInstagramProfile?.profileImageUrl ?? existingArtist?.instagramProfileImageUrl ?? null;
    
    const scrapedWebsiteEmails = await discoverEmailsFromUrls([resolvedOfficialSiteUrl]);
    const resolvedEmailsWithWebsite = mergeEmails(resolvedEmails, scrapedWebsiteEmails);

    let resolvedBio = bio ?? enrichment.scrapedInstagramProfile?.bio ?? existingArtist?.bio ?? undefined;
    const maxFollowers = Math.max(
      followerCount ?? 0,
      enrichment.scrapedInstagramProfile?.followersCount ?? 0,
      existingArtist?.followerCount ?? 0
    );
    const resolvedFollowerCount = maxFollowers > 0 ? maxFollowers : undefined;
    
    const payloadLastPostAt = this.toDate(lastPostAt);
    const scrapedLastPostAt = enrichment.scrapedInstagramPosts?.[0]?.postedAt ? new Date(enrichment.scrapedInstagramPosts[0].postedAt) : undefined;
    const existingLastPostAt = existingArtist?.lastPostAt;
    const dateOptions = [payloadLastPostAt, scrapedLastPostAt, existingLastPostAt].filter(Boolean) as Date[];
    const resolvedLastPostAt = dateOptions.length > 0 ? new Date(Math.max(...dateOptions.map(d => d.getTime()))) : undefined;
    
    let resolvedGenre = genre ?? enrichment.scrapedSpotifyProfile?.genres?.[0] ?? existingArtist?.genre ?? undefined;
    const resolvedCity = city ?? existingArtist?.city ?? undefined;
    const resolvedState = state ?? existingArtist?.state ?? undefined;
    const resolvedCountry = country ?? existingArtist?.country ?? undefined;
    let resolvedLocation = location ?? existingArtist?.location ?? undefined;

    const needsEnrichment = !resolvedLocation || !resolvedGenre || !resolvedBio;
    if (needsEnrichment) {
      try {
        const enrichmentData = await resolveArtistEnrichment({
          name,
          bio: resolvedBio ?? enrichment.scrapedInstagramProfile?.bio ?? null,
          externalUrl: resolvedOfficialSiteUrl,
          rawData: payload.artist as unknown as Record<string, unknown>,
          skipGoogle: payload.isDiscoveryImport === true,
        });
        if (!resolvedLocation && enrichmentData.location) resolvedLocation = enrichmentData.location;
        if (!resolvedGenre && enrichmentData.genre) resolvedGenre = enrichmentData.genre;
        if (!resolvedBio && enrichmentData.externalBio) {
          const source = enrichmentData.externalBioSource === 'lastfm' ? '[Last.fm]' : enrichmentData.externalBioSource === 'discogs' ? '[Discogs]' : '';
          resolvedBio = source ? `${enrichmentData.externalBio}\n\n— ${source}` : enrichmentData.externalBio;
        }
      } catch (e) {
        logger.error(`[LeadIngestService] Enrichment failed for ${name}:`, e);
      }
    }

    const artistData = {
      name,
      instagramHandle,
      instagramProfileUrl,
      instagramProfileImageUrl: resolvedInstagramProfileImageUrl,
      spotifyArtistId: resolvedSpotifyArtistId,
      spotifyArtistUrl: resolvedSpotifyArtistUrl ?? undefined,
      spotifyImageUrl: resolvedSpotifyImageUrl,
      spotifyAccent: resolvedSpotifyAccent,
      spotifyAccentStrong: resolvedSpotifyAccentStrong,
      spotifyHighlight: resolvedSpotifyHighlight,
      officialSiteUrl: resolvedOfficialSiteUrl ?? undefined,
      location: resolvedLocation,
      city: resolvedCity,
      state: resolvedState,
      country: resolvedCountry,
      genre: resolvedGenre,
      tags: tags ?? [],
      bio: resolvedBio,
      emails: resolvedEmailsWithWebsite,
      followerCount: resolvedFollowerCount,
      lastPostAt: resolvedLastPostAt,
    };

    if (existingArtist) {
      return await prisma.artist.update({
        where: { id: existingArtist.id },
        data: artistData,
      });
    } else {
      return await prisma.artist.create({
        data: artistData,
      });
    }
  }

  private async resolveLead(artist: any, payload: LeadPayload) {
    const leadData = payload.lead;
    const existingLead = leadData?.id
      ? await prisma.lead.findUnique({ where: { id: leadData.id } })
      : await prisma.lead.findFirst({ where: { artistId: artist.id } });

    const leadUpdateData = {
      artistId: artist.id,
      status: leadData?.status ?? undefined,
      score: leadData?.score ?? undefined,
      scoreRationale: leadData?.scoreRationale ?? undefined,
      lastContactedAt: this.toDate(leadData?.lastContactedAt),
      nextActionAt: this.toDate(leadData?.nextActionAt),
    };

    if (existingLead) {
      return await prisma.lead.update({
        where: { id: existingLead.id },
        data: leadUpdateData,
      });
    } else {
      return await prisma.lead.create({
        data: leadUpdateData,
      });
    }
  }

  private async processReleases(artist: any, payload: LeadPayload, context: IngestContext) {
    const resolvedReleases = this.mergeReleases(payload.releases, context.enrichment.scrapedSpotifyReleases);

    if (!resolvedReleases?.length) return;

    await Promise.all(
      resolvedReleases.map((release) =>
        (async () => {
          try {
            const resolvedUrl =
              release.url ??
              (release.spotifyTrackId
                ? `https://open.spotify.com/track/${release.spotifyTrackId}`
                : release.spotifyReleaseId
                  ? `https://open.spotify.com/album/${release.spotifyReleaseId}`
                  : null);
            const resolvedImageUrl =
            release.imageUrl ??
            (await this.fetchSpotifyThumbnail(resolvedUrl)) ??
            artist.spotifyImageUrl ??
            undefined;

            const releaseData = {
              artistId: artist.id,
              title: release.title,
              releaseDate: this.toDate(release.releaseDate),
              imageUrl: resolvedImageUrl ?? undefined,
              url: resolvedUrl ?? undefined,
              releaseType: release.releaseType ?? undefined,
            };

            if (release.spotifyReleaseId) {
              return prisma.release.upsert({
                where: { spotifyReleaseId: release.spotifyReleaseId },
                update: releaseData,
                create: { ...releaseData, spotifyReleaseId: release.spotifyReleaseId },
              });
            }

            if (release.spotifyTrackId) {
              return prisma.release.upsert({
                where: { spotifyTrackId: release.spotifyTrackId },
                update: releaseData,
                create: { ...releaseData, spotifyTrackId: release.spotifyTrackId },
              });
            }

            return prisma.release.create({
              data: releaseData,
            });
          } catch (e) {
            logger.error(`[LeadIngestService] Failed to process release ${release.title}:`, e);
          }
        })()
      )
    );
  }

  private async processInstagramPosts(artist: any, payload: LeadPayload, context: IngestContext) {
    const resolvedPosts = this.mergeInstagramPosts(payload.instagramPosts, context.enrichment.scrapedInstagramPosts);

    if (!resolvedPosts?.length) return;

    await Promise.all(
      resolvedPosts.map((post) =>
        (async () => {
          try {
            if (post.instagramPostId) {
              return prisma.instagramPost.upsert({
                where: { instagramPostId: post.instagramPostId },
                update: {
                  artistId: artist.id,
                  caption: post.caption,
                  imageUrl: post.imageUrl ?? undefined,
                  postedAt: this.toDate(post.postedAt),
                  url: post.url,
                },
                create: {
                  artistId: artist.id,
                  instagramPostId: post.instagramPostId,
                  caption: post.caption,
                  imageUrl: post.imageUrl ?? undefined,
                  postedAt: this.toDate(post.postedAt),
                  url: post.url,
                },
              });
            } else {
              return prisma.instagramPost.create({
                data: {
                  artistId: artist.id,
                  caption: post.caption,
                  imageUrl: post.imageUrl ?? undefined,
                  postedAt: this.toDate(post.postedAt),
                  url: post.url,
                },
              });
            }
          } catch (e) {
            logger.error(`[LeadIngestService] Failed to process IG post ${post.url}:`, e);
          }
        })()
      )
    );
  }

  private async processMessageDrafts(lead: any, payload: LeadPayload) {
    if (!payload.messageDrafts?.length) return;
    await prisma.messageDraft.createMany({
      data: payload.messageDrafts.map((draft) => ({
        leadId: lead.id,
        tone: draft.tone ?? undefined,
        body: draft.body,
        source: draft.source ?? undefined,
        selected: draft.selected ?? false,
      })),
    });
  }

  private async processActivities(lead: any, payload: LeadPayload) {
    if (!payload.activities?.length) return;
    await prisma.activity.createMany({
      data: payload.activities.map((activity) => ({
        leadId: lead.id,
        type: activity.type,
        note: activity.note ?? undefined,
        occurredAt: this.toDate(activity.occurredAt) ?? new Date(),
      })),
    });
  }

  private async fetchSpotifyImageUrl(url?: string | null, id?: string | null) {
    const targetUrl = url || (id ? `https://open.spotify.com/artist/${id}` : null);
    if (!targetUrl) return null;
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(targetUrl)}`);
      if (!response.ok) return null;
      const data = (await response.json()) as { thumbnail_url?: string };
      return data.thumbnail_url ?? null;
    } catch {
      return null;
    }
  }

  private async fetchSpotifyThumbnail(url?: string | null) {
    if (!url) return null;
    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (!response.ok) return null;
      const data = (await response.json()) as { thumbnail_url?: string };
      return data.thumbnail_url ?? null;
    } catch {
      return null;
    }
  }

  private toDate(value?: string | null) {
    return value ? new Date(value) : undefined;
  }

  private mergeInstagramPosts(incoming: any[], scraped: any[]) {
    if (!scraped?.length) return incoming;
    if (!incoming?.length) return scraped;

    const incomingMap = new Map<string, any>();
    for (const post of incoming) {
      const key = post.instagramPostId ?? post.url ?? null;
      if (key) incomingMap.set(key, post);
    }

    const mergedScraped = scraped.map((post) => {
      const key = post.instagramPostId ?? post.url ?? null;
      const fallback = key ? incomingMap.get(key) : undefined;
      if (!fallback) return post;

      return {
        ...fallback,
        ...post,
        caption: post.caption ?? fallback.caption,
        imageUrl: post.imageUrl ?? fallback.imageUrl,
        postedAt: post.postedAt ?? fallback.postedAt,
        url: post.url ?? fallback.url,
        instagramPostId: post.instagramPostId ?? fallback.instagramPostId,
      };
    });

    const scrapedKeys = new Set(
      mergedScraped.map((post) => post.instagramPostId ?? post.url ?? null).filter(Boolean) as string[]
    );
    const incomingOnly = incoming.filter((post) => {
      const key = post.instagramPostId ?? post.url ?? null;
      return key ? !scrapedKeys.has(key) : true;
    });

    return [...mergedScraped, ...incomingOnly];
  }

  private mergeReleases(incoming: any[], spotify: any[]) {
    if (!spotify?.length) return incoming;
    if (!incoming?.length) return spotify;

    const getReleaseKey = (r: any) => r.spotifyReleaseId ?? r.spotifyTrackId ?? r.url ?? r.title.toLowerCase();
    const incomingMap = new Map<string, any>();
    for (const release of incoming) {
      incomingMap.set(getReleaseKey(release), release);
    }

    const mergedSpotify = spotify.map((release) => {
      const key = getReleaseKey(release);
      const fallback = incomingMap.get(key);
      if (!fallback) return release;
      return {
        ...fallback,
        ...release,
        title: release.title || fallback.title,
        url: release.url ?? fallback.url,
        imageUrl: release.imageUrl ?? fallback.imageUrl,
        releaseDate: release.releaseDate ?? fallback.releaseDate,
      };
    });

    const spotifyKeys = new Set(mergedSpotify.map((release) => getReleaseKey(release)));
    const incomingOnly = incoming.filter((release) => !spotifyKeys.has(getReleaseKey(release)));

    return [...mergedSpotify, ...incomingOnly];
  }
}
