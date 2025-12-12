export const BLOCK_SCALES = [16, 8, 4];
export const DEFAULT_ALPHAS: Record<number, number> = {
    16: 0.5,
    8: 0.35,
    4: 0.15,
};
export const DEFAULT_DENSITY = 0.5;
export const DEFAULT_LAMBDA = 0.12;
export const MID_FREQ_RANGE = [3, 7];

export interface WorkerMessage {
    type: 'protect';
    imageBitmap: ImageBitmap;
    mode: 'basic' | 'strong';
    seed?: string;
    options?: {
        alpha?: number;
        density?: number;
        lambda?: number;
        applyUniversal?: boolean;
        patternUrl?: string;
        watermark?: {
            enabled: boolean;
            type: 'text' | 'image';
            text?: string;
            watermarkBitmap?: ImageBitmap;
            opacity?: number;
            scale?: number;
        };
        styleProtection?: {
            enableColorShift: boolean;
            enableEdgeDisruption: boolean;
            enableTextureConfusion: boolean;
        };
    };
}

export interface WorkerResponse {
    type: 'done' | 'error';
    blob?: Blob;
    error?: string;
    stats?: {
        psnr: number;
        ssim: number;
        estimatedSize: number;
        processingTime: number;
        stepsTimes: Record<string, number>;
    };
}

export const DCT_SIZE = 8;
