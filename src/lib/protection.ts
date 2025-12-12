/**
 * Image Protection Service
 * 
 * Combines frequency perturbation and metadata poisoning
 * to protect images from AI training.
 */

import { processImage, loadImageFromUrl } from './perturbation';
import { applyMetadataPoisoning } from './metadata';

export interface ProtectionOptions {
    intensity: number; // 0-100
    metadataPoisoning: boolean;
}

export interface ProtectionResult {
    blob: Blob;
    url: string;
    size: number;
    processingTime: number;
}

/**
 * Protect an image file with frequency perturbation and optional metadata poisoning
 */
export async function protectImage(
    input: File | Blob | string,
    options: ProtectionOptions
): Promise<ProtectionResult> {
    const startTime = performance.now();

    // Get blob from input
    let blob: Blob;
    if (typeof input === 'string') {
        blob = await loadImageFromUrl(input);
    } else {
        blob = input;
    }

    // Apply frequency perturbation
    let protectedBlob = await processImage(blob, options.intensity);

    // Apply metadata poisoning if enabled
    if (options.metadataPoisoning) {
        protectedBlob = await applyMetadataPoisoning(protectedBlob);
    }

    const processingTime = performance.now() - startTime;

    // Create object URL for preview
    const url = URL.createObjectURL(protectedBlob);

    return {
        blob: protectedBlob,
        url,
        size: protectedBlob.size,
        processingTime,
    };
}

/**
 * Download a protected image
 */
export function downloadProtectedImage(
    result: ProtectionResult,
    originalFilename?: string
): void {
    const link = document.createElement('a');
    link.href = result.url;

    // Generate filename
    const baseName = originalFilename
        ? originalFilename.replace(/\.[^/.]+$/, '')
        : 'image';
    link.download = `${baseName}_protected.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Cleanup URL when no longer needed
 */
export function revokeProtectedUrl(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format processing time for display
 */
export function formatProcessingTime(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return `${(ms / 1000).toFixed(1)} sec`;
}
