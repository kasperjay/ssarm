import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  // Only allow proxying images from trusted CDNs to prevent SSRF
  const allowedDomains = [
    "fbcdn.net",
    "instagram.com",
    "fbsbx.com",
    "cdninstagram.com",
    "scdn.co",
    "spotifycdn.com",
    "spotify.com",
    "i.scdn.co",
    "image.lnk.to",
    "images.unsplash.com",
    "picsum.photos",
    "images.weserv.nl",
    "imgix.net",
  ];
  const isAllowed = allowedDomains.some(domain => url.includes(domain));

  if (!isAllowed) {
    console.warn(`[Proxy] Rejected domain: ${url}`);
    return new NextResponse("Forbidden domain", { status: 403 });
  }

  console.log(`[Proxy] Fetching: ${url.slice(0, 60)}...`);

  try {
    const response = await fetchIG(url);

    if (response.ok) {
      const contentType = response.headers.get("Content-Type") || "image/jpeg";
      const arrayBuffer = await response.arrayBuffer();
      console.log(`[Proxy] Success: ${url.slice(0, 80)} (${contentType}, ${arrayBuffer.byteLength} bytes)`);

      const headers = new Headers();
      headers.set("Content-Type", contentType);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");

      return new NextResponse(arrayBuffer, { headers });
    }

    if (response.status === 403) {
      // Try without query params — sometimes the base CDN path still works
      const baseUrl = url.split("?")[0];
      if (baseUrl !== url) {
        console.log(`[Proxy] 403, retrying without query params: ${baseUrl.slice(0, 80)}`);
        const retryResponse = await fetchIG(baseUrl);
        if (retryResponse.ok) {
          const contentType = retryResponse.headers.get("Content-Type") || "image/jpeg";
          const arrayBuffer = await retryResponse.arrayBuffer();
          console.log(`[Proxy] Retry success: ${baseUrl.slice(0, 80)} (${arrayBuffer.byteLength} bytes)`);
          const headers = new Headers();
          headers.set("Content-Type", contentType);
          headers.set("Cache-Control", "public, max-age=86400");
          return new NextResponse(arrayBuffer, { headers });
        }
      }
      console.warn(`[Proxy] 403 expired/unavailable: ${url.slice(0, 80)}`);
      return new NextResponse("Image expired or unavailable", { status: 410 });
    }

    const errorText = await response.text().catch(() => "No error body");
    console.error(`[Proxy] Failed to fetch ${url}: ${response.status} - ${errorText.slice(0, 100)}`);
    return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Proxy] Internal error: ${errorMessage}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function fetchIG(url: string) {
  const isInstagram = url.includes("instagram") || url.includes("cdninstagram") || url.includes("fbcdn.net");
  return fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": isInstagram
        ? "https://www.instagram.com/"
        : "https://open.spotify.com/",
      ...(isInstagram
        ? {
            "Origin": "https://www.instagram.com",
            "Sec-Fetch-Dest": "image",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "Cache-Control": "max-age=0",
          }
        : {}),
    },
    next: { revalidate: 0 },
  });
}
