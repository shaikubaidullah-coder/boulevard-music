// Runtime dynamic color sampler for artwork images using offscreen canvas

const colorCache = new Map<string, string>();

/**
 * Extracts a soft, atmospheric RGBA color from an image URL.
 * Falls back to fallbackColor if extraction fails or isn't possible.
 */
export async function extractAtmosphereColor(
  imageUrl: string,
  fallbackColor: string = 'rgba(95, 135, 155, 0.15)'
): Promise<string> {
  if (typeof window === 'undefined') return fallbackColor;
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timeout = setTimeout(() => {
      resolve(fallbackColor);
    }, 1500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(fallbackColor);
          return;
        }

        // Sample at 40x40 for fast, smooth average
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);

        const imageData = ctx.getImageData(0, 0, 40, 40).data;
        let rTotal = 0;
        let gTotal = 0;
        let bTotal = 0;
        let count = 0;

        for (let i = 0; i < imageData.length; i += 16) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          // Skip completely transparent or extreme white/black pixels
          if (a > 200 && !(r > 245 && g > 245 && b > 245) && !(r < 15 && g < 15 && b < 15)) {
            rTotal += r;
            gTotal += g;
            bTotal += b;
            count++;
          }
        }

        if (count === 0) {
          resolve(fallbackColor);
          return;
        }

        const avgR = Math.round(rTotal / count);
        const avgG = Math.round(gTotal / count);
        const avgB = Math.round(bTotal / count);

        // Soft, cinematic tint with 0.16 opacity
        const extracted = `rgba(${avgR}, ${avgG}, ${avgB}, 0.16)`;
        colorCache.set(imageUrl, extracted);
        resolve(extracted);
      } catch (err) {
        console.warn('Atmosphere color extraction fallback:', err);
        resolve(fallbackColor);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(fallbackColor);
    };

    img.src = imageUrl;
  });
}
