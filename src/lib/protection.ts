import ProtectionWorker from '../worker/pixshadeWorker?worker';
import type { WorkerMessage, WorkerResponse } from '../worker/constants';

export interface ProtectionOptions {
    intensity: number; // 0-100
    metadataPoisoning: boolean;
    watermark?: {
        enabled: boolean;
        type: 'text' | 'image';
        text?: string;
        imageBitmap?: ImageBitmap;
        opacity?: number;
        scale?: number;
    };
    styleProtection?: {
        enableColorShift: boolean;
        enableEdgeDisruption: boolean;
        enableTextureConfusion: boolean;
        sketchMode?: boolean;
    };
}

export interface ProtectionResult {
    blob: Blob;
    url: string;
    size: number;
    processingTime: number;
    psnr?: number;
    ssim?: number;
}

/**
 * Protect an image file with frequency perturbation and optional metadata poisoning
 * Uses WebWorker for performance and non-blocking UI.
 */
export async function protectImage(
    input: File | Blob | string,
    options: ProtectionOptions
): Promise<ProtectionResult> {
    const startTime = performance.now();

    // Load input
    let bitmap: ImageBitmap;
    let originalFilename = 'image';

    if (typeof input === 'string') {
        const resp = await fetch(input);
        const blob = await resp.blob();
        bitmap = await createImageBitmap(blob);
        originalFilename = input.split('/').pop() || 'image';
    } else {
        bitmap = await createImageBitmap(input);
        if (input instanceof File) originalFilename = input.name;
    }

    // Build transferable list
    const transferables: Transferable[] = [bitmap];
    if (options.watermark?.imageBitmap) {
        transferables.push(options.watermark.imageBitmap);
    }

    return new Promise((resolve, reject) => {
        const worker = new ProtectionWorker();

        const message: WorkerMessage = {
            type: 'protect',
            imageBitmap: bitmap,
            mode: 'basic',
            seed: originalFilename + Date.now().toString(),
            options: {
                alpha: options.intensity,
                watermark: options.watermark ? {
                    enabled: options.watermark.enabled,
                    type: options.watermark.type,
                    text: options.watermark.text,
                    watermarkBitmap: options.watermark.imageBitmap,
                    opacity: options.watermark.opacity,
                    scale: options.watermark.scale,
                } : undefined,
                styleProtection: options.styleProtection,
            }
        };

        worker.postMessage(message, transferables);

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { type, blob, stats, error } = e.data;

            if (type === 'error') {
                worker.terminate();
                reject(new Error(error));
            } else if (type === 'done' && blob) {
                const url = URL.createObjectURL(blob);
                resolve({
                    blob,
                    url,
                    size: blob.size,
                    processingTime: stats?.processingTime || (performance.now() - startTime),
                    psnr: stats?.psnr,
                    ssim: stats?.ssim
                });
                worker.terminate();
            }
        };

        worker.onerror = (err) => {
            worker.terminate();
            reject(err);
        };
    });
}

/**
 * Download a protected image (Unchanged)
 */
export function downloadProtectedImage(
    result: ProtectionResult,
    originalFilename?: string
): void {
    const link = document.createElement('a');
    link.href = result.url;
    const baseName = originalFilename
        ? originalFilename.replace(/\.[^/.]+$/, '')
        : 'image';
    link.download = `${baseName}_protected.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Cleanup URL (Unchanged)
 */
export function revokeProtectedUrl(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Format file size (Unchanged)
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format processing time (Unchanged)
 */
export function formatProcessingTime(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return `${(ms / 1000).toFixed(1)} sec`;
}
