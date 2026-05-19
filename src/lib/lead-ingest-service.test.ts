import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeadIngestService, LeadPayload } from './lead-ingest-service';
import { prisma } from './prisma';

vi.mock('./prisma', () => ({
  prisma: {
    artist: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    lead: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    release: {
      upsert: vi.fn(),
      create: vi.fn(),
    },
    instagramPost: {
      upsert: vi.fn(),
      create: vi.fn(),
    },
    messageDraft: {
      createMany: vi.fn(),
    },
    activity: {
      createMany: vi.fn(),
    },
  },
}));

describe('LeadIngestService', () => {
  let service: LeadIngestService;

  beforeEach(() => {
    service = new LeadIngestService();
    vi.clearAllMocks();
  });

  it('should throw error if artist name is missing', async () => {
    const payload: any = { artist: { name: '' } };
    await expect(service.ingestLead(payload)).rejects.toThrow('artist.name is missing or invalid after cleaning');
  });

  it('should create a new artist and lead if none exist', async () => {
    const payload: any = {
      artist: { name: 'Test Artist' },
      lead: { status: 'NEW' }
    };
    
    (prisma.artist.findFirst as any).mockResolvedValue(null);
    (prisma.artist.create as any).mockResolvedValue({ id: 'artist-123' });
    (prisma.lead.findFirst as any).mockResolvedValue(null);
    (prisma.lead.create as any).mockResolvedValue({ id: 'lead-123' });

    const result = await service.ingestLead(payload);
    expect(result).toEqual({ artistId: 'artist-123', leadId: 'lead-123' });
  });
});
