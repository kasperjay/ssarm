import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "scontent.cdninstagram.com",
  "scontent.xx.fbcdn.net",
  "scontent.com",
  "cdninstagram.com",
  "fbcdn.net",
  "instagram.com",
  "www.instagram.com",
]);

const isAllowedHost = (host: string) => {
  if (ALLOWED_HOSTS.has(host)) return true;
  if (host.endsWith(".cdninstagram.com")) return true;
  if (host.endsWith(".instagram.com")) return true;
  if (host.endsWith(".fbcdn.net")) return true;
  return false;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const debug = searchParams.get("debug") === "1";
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  const response = await fetch(parsed.toString(), {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      referer: "https://www.instagram.com/",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Upstream error", status: response.status },
      { status: 502 }
    );
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const tryFetchImage = async (imageUrl: string) => {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        referer: "https://www.instagram.com/",
      },
      cache: "no-store",
    });
    if (!imageResponse.ok) return null;
    const imageType = imageResponse.headers.get("content-type") ?? "image/jpeg";
    const imageBuffer = await imageResponse.arrayBuffer();
    return { imageType, imageBuffer };
  };

  if (contentType.includes("text/html")) {
    const html = await response.text();
    const match =
      html.match(/property=\"og:image\" content=\"([^\"]+)\"/i) ||
      html.match(/content=\"([^\"]+)\" property=\"og:image\"/i);
    const ogImage = match?.[1];
    let ogImageStatus: number | null = null;
    if (ogImage) {
      const fetched = await tryFetchImage(ogImage);
      if (fetched) {
        return new NextResponse(fetched.imageBuffer, {
          status: 200,
          headers: {
            "content-type": fetched.imageType,
            "cache-control": "public, max-age=3600",
          },
        });
      }
      ogImageStatus = 502;
    }

    let jsonStatus: number | null = null;
    let jsonImage: string | null = null;
    if (parsed.hostname.endsWith("instagram.com") && parsed.pathname.includes("/p/")) {
      const jsonUrl = `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}/?__a=1&__d=dis`;
      try {
        const jsonResponse = await fetch(jsonUrl, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
            accept: "application/json,text/plain,*/*",
            referer: "https://www.instagram.com/",
          },
          cache: "no-store",
        });
        jsonStatus = jsonResponse.status;
        if (jsonResponse.ok) {
          const data = (await jsonResponse.json()) as Record<string, unknown>;
          const graphql = data?.graphql as Record<string, unknown> | undefined;
          const media = graphql?.shortcode_media as Record<string, unknown> | undefined;
          const displayUrl = media?.display_url as string | undefined;
          const xdt = data?.xdt_shortcode_media as Record<string, unknown> | undefined;
          const xdtDisplay = xdt?.display_url as string | undefined;
          jsonImage = displayUrl || xdtDisplay || null;
          if (jsonImage) {
            const fetched = await tryFetchImage(jsonImage);
            if (fetched) {
              return new NextResponse(fetched.imageBuffer, {
                status: 200,
                headers: {
                  "content-type": fetched.imageType,
                  "cache-control": "public, max-age=3600",
                },
              });
            }
          }
        }
      } catch {
        jsonStatus = 500;
      }
    }

    let mediaStatus: number | null = null;
    if (parsed.hostname.endsWith("instagram.com") && parsed.pathname.includes("/p/")) {
      const mediaUrl = `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}/media/?size=l`;
      const fetched = await tryFetchImage(mediaUrl);
      if (fetched) {
        return new NextResponse(fetched.imageBuffer, {
          status: 200,
          headers: {
            "content-type": fetched.imageType,
            "cache-control": "public, max-age=3600",
          },
        });
      }
      mediaStatus = 502;
    }

    if (debug) {
      return NextResponse.json(
        {
          upstreamStatus: response.status,
          upstreamContentType: contentType,
          ogImage: ogImage ?? null,
          ogImageStatus,
          jsonStatus,
          jsonImage,
          mediaStatus,
          htmlSnippet: html.slice(0, 800),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Missing og:image" }, { status: 502 });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600",
    },
  });
}
