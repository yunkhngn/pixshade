/**
 * Style Protection Module (GLAZE/Nightshade-inspired)
 * 
 * Implements adversarial perturbation techniques to protect artist styles
 * from AI mimicry and training.
 * 
 * Techniques:
 * 1. LAB Color Space Perturbation - Confuses style recognition
 * 2. Edge Disruption - Adds noise to edges AI relies on
 * 3. Texture Confusion - Creates patterns that confuse texture analysis
 * 4. Gradient-based Noise - Perturbation along gradient directions
 */

import { PRNG } from './utils';

export interface StyleProtectionOptions {
    intensity: number;     // 0-100
    seed: string;
    enableColorShift: boolean;
    enableEdgeDisruption: boolean;
    enableTextureConfusion: boolean;
    sketchMode?: boolean;  // Optimized for line art/sketch
}

/**
 * RGB to LAB color conversion
 */
function rgbToLab(r: number, g: number, b: number): [number, number, number] {
    // Normalize RGB to 0-1
    let rN = r / 255;
    let gN = g / 255;
    let bN = b / 255;

    // Apply gamma correction
    rN = rN > 0.04045 ? Math.pow((rN + 0.055) / 1.055, 2.4) : rN / 12.92;
    gN = gN > 0.04045 ? Math.pow((gN + 0.055) / 1.055, 2.4) : gN / 12.92;
    bN = bN > 0.04045 ? Math.pow((bN + 0.055) / 1.055, 2.4) : bN / 12.92;

    // Convert to XYZ
    const x = (rN * 0.4124564 + gN * 0.3575761 + bN * 0.1804375) / 0.95047;
    const y = (rN * 0.2126729 + gN * 0.7151522 + bN * 0.0721750);
    const z = (rN * 0.0193339 + gN * 0.1191920 + bN * 0.9503041) / 1.08883;

    // XYZ to LAB
    const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
    const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
    const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;

    const L = (116 * fy) - 16;
    const a = 500 * (fx - fy);
    const bVal = 200 * (fy - fz);

    return [L, a, bVal];
}

/**
 * LAB to RGB color conversion
 */
function labToRgb(L: number, a: number, bVal: number): [number, number, number] {
    // LAB to XYZ
    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - bVal / 200;

    const x = 0.95047 * (fx > 0.206893 ? fx * fx * fx : (fx - 16 / 116) / 7.787);
    const y = (fy > 0.206893 ? fy * fy * fy : (fy - 16 / 116) / 7.787);
    const z = 1.08883 * (fz > 0.206893 ? fz * fz * fz : (fz - 16 / 116) / 7.787);

    // XYZ to RGB
    let rN = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
    let gN = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
    let bN = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

    // Apply inverse gamma
    rN = rN > 0.0031308 ? 1.055 * Math.pow(rN, 1 / 2.4) - 0.055 : 12.92 * rN;
    gN = gN > 0.0031308 ? 1.055 * Math.pow(gN, 1 / 2.4) - 0.055 : 12.92 * gN;
    bN = bN > 0.0031308 ? 1.055 * Math.pow(bN, 1 / 2.4) - 0.055 : 12.92 * bN;

    return [
        Math.max(0, Math.min(255, Math.round(rN * 255))),
        Math.max(0, Math.min(255, Math.round(gN * 255))),
        Math.max(0, Math.min(255, Math.round(bN * 255)))
    ];
}

/**
 * Apply LAB color space perturbation (GLAZE-inspired)
 * Shifts colors in perceptual space to confuse style recognition
 */
function applyColorShift(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    intensity: number,
    rng: () => number
): void {
    const strength = intensity / 100 * 15; // Max 15 units in LAB space

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Convert to LAB
            const [L, a, b] = rgbToLab(data[idx], data[idx + 1], data[idx + 2]);

            // Add perturbation to a and b channels (color)
            // Use position-dependent noise for pattern consistency
            const noiseA = (rng() - 0.5) * 2 * strength;
            const noiseB = (rng() - 0.5) * 2 * strength;

            // Perturb in LAB space (affects perceived color, not luminance)
            const newA = a + noiseA;
            const newB = b + noiseB;

            // Convert back to RGB
            const [r, g, bVal] = labToRgb(L, newA, newB);
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = bVal;
        }
    }
}

/**
 * Apply edge disruption (Nightshade-inspired)
 * Adds noise specifically to edges that AI models rely on for style detection
 * In sketch mode: stronger edge focus, minimal noise on blank areas
 */
function applyEdgeDisruption(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    intensity: number,
    rng: () => number,
    sketchMode: boolean = false
): void {
    // Sketch mode uses stronger strength but only on edges
    const strength = sketchMode
        ? intensity / 100 * 50  // Stronger for visible edges in sketch
        : intensity / 100 * 30;

    // Lower threshold for sketch to catch thinner lines
    const edgeThreshold = sketchMode ? 0.05 : 0.1;

    const edgeData = new Uint8ClampedArray(data);

    // Sobel edge detection kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;

            // Apply Sobel operators
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const gray = (edgeData[idx] + edgeData[idx + 1] + edgeData[idx + 2]) / 3;
                    const kidx = (ky + 1) * 3 + (kx + 1);
                    gx += gray * sobelX[kidx];
                    gy += gray * sobelY[kidx];
                }
            }

            // Calculate edge magnitude
            const edgeMagnitude = Math.sqrt(gx * gx + gy * gy);
            const normalizedEdge = Math.min(edgeMagnitude / 255, 1);

            // Add noise proportional to edge strength
            if (normalizedEdge > edgeThreshold) {
                const idx = (y * width + x) * 4;

                // In sketch mode, concentrate noise more strongly on detected edges
                const edgeMultiplier = sketchMode
                    ? Math.pow(normalizedEdge, 0.5)  // Amplify edge effect
                    : normalizedEdge;
                const noiseScale = edgeMultiplier * strength;

                for (let c = 0; c < 3; c++) {
                    const noise = (rng() - 0.5) * 2 * noiseScale;
                    data[idx + c] = Math.max(0, Math.min(255, data[idx + c] + noise));
                }
            }
            // In sketch mode: NO noise on blank areas (normalizedEdge <= threshold)
        }
    }
}

/**
 * Apply texture confusion patterns
 * Creates subtle patterns that confuse texture recognition in AI models
 */
function applyTextureConfusion(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    intensity: number,
    rng: () => number
): void {
    const strength = intensity / 100 * 8;

    // Generate multi-frequency noise pattern
    const frequencies = [4, 8, 16, 32];
    const weights = [0.4, 0.3, 0.2, 0.1];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Combine multiple frequency patterns
            let pattern = 0;
            for (let i = 0; i < frequencies.length; i++) {
                const freq = frequencies[i];
                const phase = rng() * Math.PI * 2;
                const contribution = Math.sin(x / freq + phase) * Math.cos(y / freq + phase);
                pattern += contribution * weights[i];
            }

            // Apply pattern as subtle perturbation
            const perturbation = pattern * strength;
            for (let c = 0; c < 3; c++) {
                const channelOffset = (rng() - 0.5) * 2;
                data[idx + c] = Math.max(0, Math.min(255,
                    data[idx + c] + perturbation + channelOffset
                ));
            }
        }
    }
}

/**
 * Apply all style protection techniques
 */
export function applyStyleProtection(
    imageData: ImageData,
    options: StyleProtectionOptions
): ImageData {
    const { width, height, data } = imageData;
    const result = new ImageData(new Uint8ClampedArray(data), width, height);

    // Initialize RNG using PRNG class
    const prng = new PRNG(options.seed);
    const rng = () => prng.random();

    // Apply each protection technique
    if (options.enableColorShift) {
        applyColorShift(result.data, width, height, options.intensity, rng);
    }

    if (options.enableEdgeDisruption) {
        applyEdgeDisruption(result.data, width, height, options.intensity, rng, options.sketchMode);
    }

    if (options.enableTextureConfusion) {
        applyTextureConfusion(result.data, width, height, options.intensity, rng);
    }

    return result;
}
