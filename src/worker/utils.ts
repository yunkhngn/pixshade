
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

export function quickSSIM(_original: Uint8ClampedArray, _modified: Uint8ClampedArray, _width: number, _height: number): number {

    return 0;
}
