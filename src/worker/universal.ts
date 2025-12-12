import { DEFAULT_LAMBDA } from './constants';

async function fetchPattern(url: string): Promise<Float32Array | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const buffer = await response.arrayBuffer();

        return new Float32Array(buffer);
    } catch (e) {
        console.error('Failed to fetch pattern', e);
        return null; // Fail gracefully
    }
}

export async function fetchAndApplyUniversal(
    imageBitmap: ImageBitmap,
    patternUrl: string,
    lambda: number = DEFAULT_LAMBDA
): Promise<ImageData> {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const pattern = await fetchPattern(patternUrl);
    if (!pattern) {
        return imageData;
    }

    const patternLen = pattern.length;
    const side = Math.sqrt(patternLen / 3);
    if (!Number.isInteger(side)) {
        console.warn('Pattern not square/RGB', patternLen);
        return imageData;
    }
    const pW = side;
    const pH = side;

    const channels = 3;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const py = y % pH;
            const px = x % pW;

            const pIdx = (py * pW + px) * channels;
            const idx = (y * width + x) * 4;

            for (let c = 0; c < 3; c++) {
                const v = pattern[pIdx + c];

                let change = v * lambda;

                if (Math.abs(change) < 0.01 && v !== 0) change *= 255;

                data[idx + c] = Math.min(255, Math.max(0, data[idx + c] + change));
            }
        }
    }

    return imageData;
}
