
export class PRNG {
    private s: Uint32Array;

    constructor(seed: string) {
        this.s = new Uint32Array(4);
        // Initialize state with string hash (MurmurHash3-like mixed)
        let h = 2166136261 >>> 0;
        for (let i = 0; i < seed.length; i++) {
            h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
        }

        // Fill the 4 state variables
        for (let i = 0; i < 4; i++) {
            this.s[i] = this.splitMix32(h += 0x9e3779b9);
        }
    }

    // Simple SplitMix32 for seeding
    private splitMix32(a: number): number {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0);
    }

    private rotl(x: number, k: number): number {
        return (x << k) | (x >>> (32 - k));
    }

    next(): number {
        const s0 = this.s[0];
        const s1 = this.s[1];
        const s2 = this.s[2];
        const s3 = this.s[3];

        const result = this.rotl(s1 * 5, 7) * 9;

        const t = s1 << 9;

        this.s[2] ^= s0;
        this.s[3] ^= s1;
        this.s[1] ^= s2;
        this.s[0] ^= s3;

        this.s[2] ^= t;

        this.s[3] = this.rotl(this.s[3], 11);

        return result >>> 0;
    }

    // Return float in [0, 1)
    random(): number {
        return this.next() / 4294967296;
    }
}

/**
 * Compute Peak Signal-to-Noise Ratio (PSNR)
 */
export function computePSNR(original: Uint8ClampedArray, modified: Uint8ClampedArray): number {
    if (original.length !== modified.length) {
        throw new Error('Image dimensions mismatch');
    }

    let mse = 0;
    const len = original.length;

    for (let i = 0; i < len; i++) {
        const diff = original[i] - modified[i];
        mse += diff * diff;
    }

    mse /= len;

    if (mse === 0) return Infinity;

    // Max value is 255
    return 10 * Math.log10((255 * 255) / mse);
}

/**
 * Compute Structural Similarity Index (SSIM)
 * Simplified version using 8x8 windows
 */
export function computeSSIM(
    original: Uint8ClampedArray,
    modified: Uint8ClampedArray,
    width: number,
    height: number
): number {
    const C1 = (0.01 * 255) ** 2;
    const C2 = (0.03 * 255) ** 2;
    const windowSize = 8;

    // Convert to grayscale arrays
    const gray1 = new Float32Array(width * height);
    const gray2 = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        gray1[i] = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2];
        gray2[i] = 0.299 * modified[idx] + 0.587 * modified[idx + 1] + 0.114 * modified[idx + 2];
    }

    let ssimSum = 0;
    let windowCount = 0;

    // Slide window across image
    for (let y = 0; y <= height - windowSize; y += windowSize) {
        for (let x = 0; x <= width - windowSize; x += windowSize) {
            let mean1 = 0, mean2 = 0;
            const n = windowSize * windowSize;

            // Calculate means
            for (let wy = 0; wy < windowSize; wy++) {
                for (let wx = 0; wx < windowSize; wx++) {
                    const idx = (y + wy) * width + (x + wx);
                    mean1 += gray1[idx];
                    mean2 += gray2[idx];
                }
            }
            mean1 /= n;
            mean2 /= n;

            // Calculate variances and covariance
            let var1 = 0, var2 = 0, covar = 0;
            for (let wy = 0; wy < windowSize; wy++) {
                for (let wx = 0; wx < windowSize; wx++) {
                    const idx = (y + wy) * width + (x + wx);
                    const d1 = gray1[idx] - mean1;
                    const d2 = gray2[idx] - mean2;
                    var1 += d1 * d1;
                    var2 += d2 * d2;
                    covar += d1 * d2;
                }
            }
            var1 /= (n - 1);
            var2 /= (n - 1);
            covar /= (n - 1);

            // SSIM formula
            const numerator = (2 * mean1 * mean2 + C1) * (2 * covar + C2);
            const denominator = (mean1 * mean1 + mean2 * mean2 + C1) * (var1 + var2 + C2);
            ssimSum += numerator / denominator;
            windowCount++;
        }
    }

    return windowCount > 0 ? ssimSum / windowCount : 1;
}
