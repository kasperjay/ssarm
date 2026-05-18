import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerReplyNotification } from '@/lib/novu';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'spectral_webhook_secret_2026') {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, handle, source, message } = body;

    if (!email && !handle) {
      return NextResponse.json({ error: 'Missing identifier (email or handle)' }, { status: 400 });
    }

    // 1. Find the artist
    const whereClause: any = {
      OR: [],
    };

    if (email) {
      whereClause.OR.push({ emails: { has: email } });
    }

    if (handle) {
      whereClause.OR.push({ instagramHandle: handle });
    }

    const artist = await prisma.artist.findFirst({
      where: whereClause,
      include: {
        leads: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const lead = artist.leads[0];
    if (!lead) {
      return NextResponse.json({ error: 'No lead associated with this artist' }, { status: 404 });
    }

    // 2. Update Lead Status to REPLY_RECEIVED
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: 'REPLY_RECEIVED' as any,
        updatedAt: new Date(),
      },
    });

    // 3. Log the activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'REPLY_RECEIVED',
        note: `Reply received via ${source}. Message: ${message || 'No content provided'}`,
        occurredAt: new Date(),
      },
    });

    // 4. Trigger Novu Notification
    await triggerReplyNotification(artist.name, source as 'Instagram' | 'Email');

    return NextResponse.json({ 
      success: true, 
      message: `Updated lead status for ${artist.name} to REPLY_RECEIVED and triggered notification.` 
    });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
