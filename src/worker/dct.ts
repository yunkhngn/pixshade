import { DCT_SIZE, BLOCK_SCALES, DEFAULT_ALPHAS, MID_FREQ_RANGE, DEFAULT_DENSITY } from './constants';
import { PRNG } from './utils';

// --- DCT Core Math ---
const COS_TABLE: number[][] = [];
const ALPHA_TABLE: number[] = [1 / Math.sqrt(2), 1, 1, 1, 1, 1, 1, 1];

for (let k = 0; k < DCT_SIZE; k++) {
    COS_TABLE[k] = [];
    for (let n = 0; n < DCT_SIZE; n++) {
        COS_TABLE[k][n] = Math.cos(((2 * n + 1) * k * Math.PI) / (2 * DCT_SIZE));
    }
}

export function dct8x8(block: Float32Array) {
    const temp = new Float32Array(64);

    for (let y = 0; y < DCT_SIZE; y++) {
        for (let u = 0; u < DCT_SIZE; u++) {
            let sum = 0;
            for (let x = 0; x < DCT_SIZE; x++) {
                sum += block[y * DCT_SIZE + x] * COS_TABLE[u][x];
            }
            sum *= 0.5 * ALPHA_TABLE[u];
            temp[y * DCT_SIZE + u] = sum;
        }
    }

    for (let x = 0; x < DCT_SIZE; x++) {
        for (let v = 0; v < DCT_SIZE; v++) {
            let sum = 0;
            for (let y = 0; y < DCT_SIZE; y++) {
                sum += temp[y * DCT_SIZE + x] * COS_TABLE[v][y];
            }
            sum *= 0.5 * ALPHA_TABLE[v];
            block[v * DCT_SIZE + x] = sum;
        }
    }
}

export function idct8x8(block: Float32Array) {
    const temp = new Float32Array(64);

    for (let y = 0; y < DCT_SIZE; y++) {
        for (let x = 0; x < DCT_SIZE; x++) {
            let sum = 0;
            for (let u = 0; u < DCT_SIZE; u++) {
                sum += block[y * DCT_SIZE + u] * COS_TABLE[u][x] * ALPHA_TABLE[u];
            }
            sum *= 0.5;
            temp[y * DCT_SIZE + x] = sum;
        }
    }

    for (let x = 0; x < DCT_SIZE; x++) {
        for (let y = 0; y < DCT_SIZE; y++) {
            let sum = 0;
            for (let v = 0; v < DCT_SIZE; v++) {
                sum += temp[v * DCT_SIZE + x] * COS_TABLE[v][y] * ALPHA_TABLE[v];
            }
            sum *= 0.5;
            block[y * DCT_SIZE + x] = sum;
        }
    }
}


export interface DCTOptions {
    scales?: number[];
    alphas?: Record<number, number>;
    density?: number;
    seed?: string;
    intensity?: number;
}

export function applyMultiScaleDCT(
    imageBitmap: ImageBitmap,
    options: DCTOptions
): ImageData {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const scales = options.scales || BLOCK_SCALES;
    const baseAlphas = options.alphas || DEFAULT_ALPHAS;
    const density = options.density !== undefined ? options.density : DEFAULT_DENSITY;
    const seed = options.seed || 'pixshade';
    const intensity = options.intensity !== undefined ? (options.intensity / 50.0) : 1.0;

    const prng = new PRNG(seed);

    for (const scale of scales) {
        const blockSize = scale;
        const alpha = (baseAlphas[scale] || 0.1) * intensity;

        if (blockSize === 8) {
            applyDCTPass(data, width, height, alpha, density, prng);
        } else {
            const factor = 8 / blockSize;

            if (width * factor > 4096 || height * factor > 4096) continue;
            if (width * factor < 32 || height * factor < 32) continue;

            const scaledW = Math.floor(width * factor);
            const scaledH = Math.floor(height * factor);

            const tempCanvas = new OffscreenCanvas(scaledW, scaledH);
            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;

            tempCtx.drawImage(imageBitmap, 0, 0, scaledW, scaledH);

            const tempImageData = tempCtx.getImageData(0, 0, scaledW, scaledH);

            const originalScaledData = new Uint8ClampedArray(tempImageData.data);

            applyDCTPass(tempImageData.data, scaledW, scaledH, alpha, density, prng);

            for (let i = 0; i < tempImageData.data.length; i += 4) {
                tempImageData.data[i] = 127 + (tempImageData.data[i] - originalScaledData[i]);
                tempImageData.data[i + 1] = 127 + (tempImageData.data[i + 1] - originalScaledData[i + 1]);
                tempImageData.data[i + 2] = 127 + (tempImageData.data[i + 2] - originalScaledData[i + 2]);
                tempImageData.data[i + 3] = 255;
            }

            tempCtx.putImageData(tempImageData, 0, 0);

            const diffCanvas = new OffscreenCanvas(width, height);
            const diffCtx = diffCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
            diffCtx.drawImage(tempCanvas, 0, 0, width, height);

            const diffImageData = diffCtx.getImageData(0, 0, width, height);
            const diffData = diffImageData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, Math.max(0, data[i] + (diffData[i] - 127)));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (diffData[i + 1] - 127)));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (diffData[i + 2] - 127)));
            }
        }
    }

    return new ImageData(data, width, height);
}

function applyDCTPass(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    alpha: number,
    density: number,
    prng: PRNG
) {
    const channels = [0, 1, 2];
    const block = new Float32Array(64);

    for (let by = 0; by < height; by += DCT_SIZE) {
        for (let bx = 0; bx < width; bx += DCT_SIZE) {

            const blockHash = prng.random();
            if (blockHash > density) continue;

            for (const ch of channels) {
                for (let y = 0; y < DCT_SIZE; y++) {
                    for (let x = 0; x < DCT_SIZE; x++) {
                        const idx = ((by + y) * width + (bx + x)) * 4 + ch;
                        if (bx + x < width && by + y < height) {
                            block[y * DCT_SIZE + x] = data[idx];
                        } else {
                            block[y * DCT_SIZE + x] = 0;
                        }
                    }
                }

                dct8x8(block);

                const [minFreq, maxFreq] = MID_FREQ_RANGE;
                const patternScale = alpha * 10;

                for (let v = 0; v < DCT_SIZE; v++) {
                    for (let u = 0; u < DCT_SIZE; u++) {
                        const freq = u + v;
                        if (freq >= minFreq && freq <= maxFreq) {
                            const sign = (u % 2) === (v % 2) ? 1 : -1;

                            block[v * DCT_SIZE + u] += sign * patternScale;
                        }
                    }
                }

                idct8x8(block);

                for (let y = 0; y < DCT_SIZE; y++) {
                    for (let x = 0; x < DCT_SIZE; x++) {
                        const idx = ((by + y) * width + (bx + x)) * 4 + ch;
                        if (bx + x < width && by + y < height) {
                            data[idx] = Math.min(255, Math.max(0, block[y * DCT_SIZE + x]));
                        }
                    }
                }
            }
        }
    }
}


export function applyTiledSignature(
    imageBitmap: ImageBitmap,
    seed: string,
    tileSize: number = 32
): ImageData {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const prng = new PRNG(seed);
    const block = new Float32Array(64);

    for (let ty = 0; ty < height; ty += tileSize) {
        for (let tx = 0; tx < width; tx += tileSize) {
            const r = prng.next();
            const action = r % 4;

            if (action === 0) continue;

            const tileW = Math.min(tileSize, width - tx);
            const tileH = Math.min(tileSize, height - ty);

            for (let by = 0; by < tileH; by += DCT_SIZE) {
                for (let bx = 0; bx < tileW; bx += DCT_SIZE) {
                    const absX = tx + bx;
                    const absY = ty + by;

                    for (let ch = 0; ch < 3; ch++) {
                        for (let y = 0; y < DCT_SIZE; y++) {
                            for (let x = 0; x < DCT_SIZE; x++) {
                                const idx = ((absY + y) * width + (absX + x)) * 4 + ch;
                                if (absX + x < width && absY + y < height) {
                                    block[y * DCT_SIZE + x] = data[idx];
                                } else {
                                    block[y * DCT_SIZE + x] = 0;
                                }
                            }
                        }

                        dct8x8(block);

                        for (let i = 10; i < 50; i++) {
                            if (action === 1) block[i] += 2.0;
                            else if (action === 2) block[i] -= 2.0;
                            else if (action === 3) block[i] *= -1;
                        }

                        idct8x8(block);

                        for (let y = 0; y < DCT_SIZE; y++) {
                            for (let x = 0; x < DCT_SIZE; x++) {
                                const idx = ((absY + y) * width + (absX + x)) * 4 + ch;
                                if (absX + x < width && absY + y < height) {
                                    data[idx] = Math.min(255, Math.max(0, block[y * DCT_SIZE + x]));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return imageData;
}
