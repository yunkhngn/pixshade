/**
 * ZIP Export Utility
 * Bundles protected images into a downloadable ZIP file
 */

import JSZip from 'jszip';
import type { ProtectionResult } from './protection';

export interface BatchResult {
    filename: string;
    result: ProtectionResult;
}

/**
 * Create a ZIP file from batch processing results
 */
export async function createZipFromResults(results: BatchResult[]): Promise<Blob> {
    const zip = new JSZip();
    const folder = zip.folder('pixshade-protected');

    if (!folder) {
        throw new Error('Failed to create ZIP folder');
    }

    for (const { filename, result } of results) {
        const baseName = filename.replace(/\.[^/.]+$/, '');
        const protectedName = `${baseName}_protected.png`;
        folder.file(protectedName, result.blob);
    }

    return zip.generateAsync({ type: 'blob' });
}

/**
 * Download ZIP file
 */
export function downloadZip(zipBlob: Blob, filename = 'pixshade-protected.zip'): void {
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
