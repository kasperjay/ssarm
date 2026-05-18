import { prisma } from "./src/lib/prisma";

async function main() {
  const artists = await prisma.artist.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { instagramPosts: true, releases: true }
      }
    }
  });

  console.log("Latest 10 Artists Status:");
  console.table(artists.map(a => ({
    name: a.name,
    ig: a.instagramHandle || 'MISSING',
    igPic: a.instagramProfileImageUrl ? 'YES' : 'NO',
    spotify: a.spotifyArtistId || 'MISSING',
    posts: a._count.instagramPosts,
    releases: a._count.releases,
    updated: a.updatedAt
  })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
