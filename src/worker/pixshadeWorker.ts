/// <reference lib="webworker" />

import { DEFAULT_ALPHAS, type WorkerMessage, type WorkerResponse } from './constants';
import { applyMultiScaleDCT, applyTiledSignature, type DCTOptions } from './dct';
import { fetchAndApplyUniversal } from './universal';
import { injectSplitXMP } from './metadata';
import { computePSNR } from './utils';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, imageBitmap, mode, seed, options } = e.data;

    if (type !== 'protect') return;

    try {
        const startTime = performance.now();
        const stats: any = { stepsTimes: {} };
        const initialSeed = seed || 'pixshade';

        let currentBitmap = imageBitmap;
        let intermediateImageData: ImageData | null = null;

        // 1. Universal Perturbation (Strong Mode)
        if (mode === 'strong' && options?.applyUniversal && options.patternUrl) {
            const uStart = performance.now();
            intermediateImageData = await fetchAndApplyUniversal(currentBitmap, options.patternUrl, options.lambda);

            currentBitmap = await createImageBitmap(intermediateImageData);
            stats.stepsTimes.universal = performance.now() - uStart;
        }

        let attempt = 0;
        let currentAlphaMultiplier = 1.0;
        const MAX_RETRIES = 2;
        let finalImageData: ImageData;

        while (true) {
            const dctStart = performance.now();

            const baseIntensity = options?.alpha !== undefined ? options.alpha : 50;
            const effectiveIntensity = baseIntensity * currentAlphaMultiplier;

            const dctOpts: DCTOptions = {
                scales: [16, 8, 4],
                alphas: DEFAULT_ALPHAS,
                density: options?.density,
                seed: initialSeed,
                intensity: effectiveIntensity
            };

            finalImageData = applyMultiScaleDCT(currentBitmap, dctOpts);

            finalImageData = applyTiledSignature(
                await createImageBitmap(finalImageData),
                initialSeed
            );

            stats.stepsTimes[`dct_attempt_${attempt}`] = performance.now() - dctStart;

            const cvs = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            const ctx = cvs.getContext('2d');
            ctx!.drawImage(imageBitmap, 0, 0);
            const originalData = ctx!.getImageData(0, 0, imageBitmap.width, imageBitmap.height).data;

            const psnr = computePSNR(originalData, finalImageData.data);
            stats.psnr = psnr;

            if (psnr >= 38 || attempt >= MAX_RETRIES) {
                break;
            }

            // Reduce alpha and retry
            currentAlphaMultiplier *= 0.8;
            attempt++;
            console.log(`PSNR ${psnr.toFixed(2)} too low, retrying with alpha * 0.8`);
        }

        // 5. Convert to Blob
        const blobStart = performance.now();
        const finalCanvas = new OffscreenCanvas(finalImageData.width, finalImageData.height);
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx!.putImageData(finalImageData, 0, 0);
        const blob = await finalCanvas.convertToBlob({ type: 'image/png' });
        stats.stepsTimes.blob = performance.now() - blobStart;

        // 6. Metadata Injection
        const metaStart = performance.now();
        const arrayBuffer = await blob.arrayBuffer();
        // injectSplitXMP
        const finalBuffer = injectSplitXMP(arrayBuffer, initialSeed);
        const finalBlob = new Blob([finalBuffer], { type: 'image/png' });
        stats.stepsTimes.metadata = performance.now() - metaStart;

        stats.estimatedSize = finalBlob.size;
        stats.processingTime = performance.now() - startTime;

        // Respond
        const response: WorkerResponse = {
            type: 'done',
            blob: finalBlob,
            stats
        };

        // imageBitmap is transferable, but we used it.
        // We didn't transfer ownership of final buffers to main thread to keep it simple,
        // but we could transfer arraybuffers if needed.
        self.postMessage(response);

    } catch (err) {
        self.postMessage({
            type: 'error',
            error: err instanceof Error ? err.message : 'Unknown worker error'
        });
    }
};
