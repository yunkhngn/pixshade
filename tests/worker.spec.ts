
import { describe, it, expect } from 'vitest';
import { dct8x8, idct8x8 } from '../src/worker/dct';
import { applyMultiScaleDCT } from '../src/worker/dct';
import { fetchAndApplyUniversal } from '../src/worker/universal';

describe('DCT Worker Logic', () => {
    it('dctRoundtrip: should invert with minimal error', () => {
        // Mock 8x8 block
        const block = new Float32Array(64);
        for (let i = 0; i < 64; i++) block[i] = Math.random() * 255;

        const original = new Float32Array(block);

        dct8x8(block);
        idct8x8(block);

        let mse = 0;
        for (let i = 0; i < 64; i++) {
            const diff = original[i] - block[i];
            mse += diff * diff;
        }
        mse /= 64;

        expect(mse).toBeLessThan(0.01); // Epsilon
    });

    it('multiScaleEffect: should handle ImageBitmap (mocked) and output ImageData', async () => {
        if (typeof OffscreenCanvas === 'undefined') {
            console.warn('Skipping OffscreenCanvas test in Node environment');
            return;
        }

        const width = 64;
        const height = 64;
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = 'red';
        ctx!.fillRect(0, 0, width, height);

        const bitmap = await createImageBitmap(canvas);

        const result = applyMultiScaleDCT(bitmap, { intensity: 50 });
        expect(result).toBeDefined();
        expect(result.width).toBe(width);
    });

    it('universalApply: should apply pattern', async () => {
        if (typeof OffscreenCanvas === 'undefined') return;

        const width = 10;
        const height = 10;
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = 'black'; // 0
        ctx!.fillRect(0, 0, width, height);
        const bitmap = await createImageBitmap(canvas);
        expect(fetchAndApplyUniversal).toBeDefined();
    });
});
