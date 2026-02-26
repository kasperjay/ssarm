import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  // Only allow proxying images from trusted CDNs to prevent SSRF
  const allowedDomains = ["fbcdn.net", "instagram.com", "scdn.co", "spotifycdn.com"];
  const isAllowed = allowedDomains.some(domain => url.includes(domain));

  if (!isAllowed) {
    return new NextResponse("Forbidden domain", { status: 403 });
  }

  console.log(`[Proxy] Fetching: ${url.slice(0, 60)}...`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.instagram.com/",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`[Proxy] Failed to fetch ${url}: ${response.status}`);
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(arrayBuffer, { headers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Proxy] Internal error: ${errorMessage}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
