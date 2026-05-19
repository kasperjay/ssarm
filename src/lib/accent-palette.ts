import sharp from "sharp";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const rgbToHsl = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 1 / 6) tn = p + (q - p) * 6 * tn;
    else if (tn < 1 / 2) tn = q;
    else if (tn < 2 / 3) tn = p + (q - p) * (2 / 3 - tn) * 6;
    else tn = p;
    return tn;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3));
  const g = Math.round(hue2rgb(p, q, h));
  const b = Math.round(hue2rgb(p, q, h - 1 / 3));
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

export async function extractAccentFromImage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());

    const { data } = await sharp(buffer)
      .resize(24, 24, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (!data || data.length < 3) return null;

    let bestPixel = { r: data[0], g: data[1], b: data[2], score: -1 };

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { s, l } = rgbToHsl(r, g, b);
      const score = s * (1 - Math.abs(l - 0.5) * 2);
      if (score > bestPixel.score) {
        bestPixel = { r, g, b, score };
      }
    }

    if (bestPixel.score < 0.1) {
      const { data: avgData } = await sharp(buffer)
        .resize(1, 1, { fit: "cover" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      return createAccentPalette(avgData[0], avgData[1], avgData[2]);
    }

    return createAccentPalette(bestPixel.r, bestPixel.g, bestPixel.b);
  } catch {
    return null;
  }
}

function createAccentPalette(r: number, g: number, b: number) {
  const { h, s, l } = rgbToHsl(r, g, b);
  if (s < 0.08) return null;

  const accentS = clamp(s + 0.25, 0.45, 0.95);
  const accentL = clamp(l < 0.45 ? l + 0.32 : l + 0.18, 0.5, 0.72);
  const accentRgb = hslToRgb(h, accentS, accentL);
  const accentStrongRgb = hslToRgb(
    h,
    clamp(accentS + 0.1, 0.55, 1),
    clamp(accentL + 0.08, 0.56, 0.8)
  );
  const highlightRgb = hslToRgb(
    h,
    clamp(accentS + 0.16, 0.6, 1),
    clamp(accentL + 0.2, 0.66, 0.88)
  );

  return {
    accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
    accentStrong: rgbToHex(accentStrongRgb.r, accentStrongRgb.g, accentStrongRgb.b),
    highlight: rgbToHex(highlightRgb.r, highlightRgb.g, highlightRgb.b),
  };
}
