
const sharp = require('sharp');

const rgbToHsl = (r, g, b) => {
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

const hslToRgb = (h, s, l) => {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p, q, t) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return { r, g, b };
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createAccentPalette = (r, g, b) => {
  const { h, s, l } = rgbToHsl(r, g, b);
  console.log('Original HSL:', { h: h.toFixed(2), s: s.toFixed(2), l: l.toFixed(2) });
  if (s < 0.08) {
      console.log('Too desaturated!');
      return null;
  }

  const accentS = clamp(s + 0.25, 0.45, 0.95);
  const accentL = clamp(l < 0.45 ? l + 0.32 : l + 0.18, 0.5, 0.72);
  const accentRgb = hslToRgb(h, accentS, accentL);
  
  return {
    accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
  };
};

async function testExtraction(url) {
    console.log('Testing URL:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Fetch failed:', response.status);
            return;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        
        console.log('--- Method 1: 1x1 resize (Current) ---');
        const { data: data1 } = await sharp(buffer)
          .resize(1, 1, { fit: "cover" })
          .removeAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        console.log('1x1 RGB:', data1[0], data1[1], data1[2]);
        console.log('Palette:', createAccentPalette(data1[0], data1[1], data1[2]));

        console.log('\n--- Method 2: 24x24 resize + find most vibrant ---');
        const { data: data2, info } = await sharp(buffer)
          .resize(24, 24, { fit: "cover" })
          .removeAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
          
        let bestPixel = { r: 0, g: 0, b: 0, s: -1 };
        for (let i = 0; i < data2.length; i += 3) {
            const r = data2[i];
            const g = data2[i+1];
            const b = data2[i+2];
            const { s, l } = rgbToHsl(r, g, b);
            // We want high saturation but also not too dark or too light
            const score = s * (1 - Math.abs(l - 0.5)); 
            if (score > bestPixel.s) {
                bestPixel = { r, g, b, s: score };
            }
        }
        console.log('Vibrant RGB:', bestPixel.r, bestPixel.g, bestPixel.b);
        console.log('Palette:', createAccentPalette(bestPixel.r, bestPixel.g, bestPixel.b));

    } catch (err) {
        console.error('Error:', err);
    }
}

// Billie Eilish's Spotify image URL (example)
testExtraction('https://i.scdn.co/image/ab6761610000e5eb986341490234795906ca5035');
