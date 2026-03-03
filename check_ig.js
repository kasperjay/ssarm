
const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.instagramPost.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { artist: true }
    });

    console.log("--- Latest 20 Instagram Posts ---");
    posts.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Artist: ${p.artist.name} (@${p.artist.instagramHandle})`);
        console.log(`Image URL: ${p.imageUrl ? p.imageUrl.slice(0, 80) + '...' : 'NULL'}`);
        console.log('---');
    });

    const nullImages = await prisma.instagramPost.count({ where: { imageUrl: null } });
    console.log(`Total posts with NULL images: ${nullImages}`);

    const totalPosts = await prisma.instagramPost.count();
    console.log(`Total posts: ${totalPosts}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
