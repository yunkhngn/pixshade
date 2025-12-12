/**
 * DCT-based Frequency Perturbation
 * 
 * Applies subtle perturbations in the frequency domain to disrupt AI training
 * while keeping visual appearance intact.
 */

// 8x8 DCT basis functions (precomputed for efficiency)
const DCT_SIZE = 8;

/**
 * Compute 1D DCT-II transform
 */
function dct1d(input: number[]): number[] {
    const N = input.length;
    const output = new Array(N).fill(0);

    for (let k = 0; k < N; k++) {
        let sum = 0;
        for (let n = 0; n < N; n++) {
            sum += input[n] * Math.cos((Math.PI / N) * (n + 0.5) * k);
        }
        output[k] = sum * (k === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N));
    }

    return output;
}

/**
 * Compute 1D IDCT (Inverse DCT)
 */
function idct1d(input: number[]): number[] {
    const N = input.length;
    const output = new Array(N).fill(0);

    for (let n = 0; n < N; n++) {
        let sum = input[0] * Math.sqrt(1 / N);
        for (let k = 1; k < N; k++) {
            sum += input[k] * Math.sqrt(2 / N) * Math.cos((Math.PI / N) * (n + 0.5) * k);
        }
        output[n] = sum;
    }

    return output;
}

/**
 * Apply 2D DCT to an 8x8 block
 */
function dct2d(block: number[][]): number[][] {
    // Apply DCT to rows
    const rowDct = block.map(row => dct1d(row));

    // Transpose and apply DCT to columns
    const transposed: number[][] = [];
    for (let i = 0; i < DCT_SIZE; i++) {
        transposed[i] = [];
        for (let j = 0; j < DCT_SIZE; j++) {
            transposed[i][j] = rowDct[j][i];
        }
    }

    const colDct = transposed.map(col => dct1d(col));

    // Transpose back
    const result: number[][] = [];
    for (let i = 0; i < DCT_SIZE; i++) {
        result[i] = [];
        for (let j = 0; j < DCT_SIZE; j++) {
            result[i][j] = colDct[j][i];
        }
    }

    return result;
}

/**
 * Apply 2D IDCT to an 8x8 block
 */
function idct2d(block: number[][]): number[][] {
    // Apply IDCT to rows
    const rowIdct = block.map(row => idct1d(row));

    // Transpose and apply IDCT to columns
    const transposed: number[][] = [];
    for (let i = 0; i < DCT_SIZE; i++) {
        transposed[i] = [];
        for (let j = 0; j < DCT_SIZE; j++) {
            transposed[i][j] = rowIdct[j][i];
        }
    }

    const colIdct = transposed.map(col => idct1d(col));

    // Transpose back
    const result: number[][] = [];
    for (let i = 0; i < DCT_SIZE; i++) {
        result[i] = [];
        for (let j = 0; j < DCT_SIZE; j++) {
            result[i][j] = colIdct[j][i];
        }
    }

    return result;
}

/**
 * Generate pseudo-random perturbation pattern based on position
 */
function generatePerturbation(x: number, y: number, intensity: number, seed: number): number {
    // Simple seeded pseudo-random based on position
    const hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    const random = hash - Math.floor(hash);
    // Map to range [-intensity, intensity]
    return (random * 2 - 1) * intensity;
}

/**
 * Apply frequency-domain perturbation to an image
 * 
 * @param imageData - ImageData from canvas
 * @param intensity - Perturbation strength (0-100)
 * @returns Modified ImageData
 */
export function applyFrequencyPerturbation(
    imageData: ImageData,
    intensity: number
): ImageData {
    const { width, height, data } = imageData;
    const result = new Uint8ClampedArray(data);

    // Normalize intensity to a perceptually appropriate range
    // Higher intensity = more perturbation but still subtle
    const perturbStrength = (intensity / 100) * 15; // Max 15 units per coefficient
    const seed = Date.now() % 10000;

    // Process image in 8x8 blocks for each color channel
    const channels = [0, 1, 2]; // R, G, B (skip alpha)

    for (const channel of channels) {
        for (let blockY = 0; blockY < height; blockY += DCT_SIZE) {
            for (let blockX = 0; blockX < width; blockX += DCT_SIZE) {
                // Extract 8x8 block
                const block: number[][] = [];
                for (let y = 0; y < DCT_SIZE; y++) {
                    block[y] = [];
                    for (let x = 0; x < DCT_SIZE; x++) {
                        const imgX = blockX + x;
                        const imgY = blockY + y;
                        if (imgX < width && imgY < height) {
                            const idx = (imgY * width + imgX) * 4 + channel;
                            block[y][x] = data[idx];
                        } else {
                            block[y][x] = 0;
                        }
                    }
                }

                // Apply DCT
                const dctBlock = dct2d(block);

                // Perturb mid-frequency coefficients (not DC, not highest frequencies)
                // Focus on coefficients that are less visually noticeable
                for (let y = 1; y < DCT_SIZE - 1; y++) {
                    for (let x = 1; x < DCT_SIZE - 1; x++) {
                        // Skip very low and very high frequency components
                        const freq = x + y;
                        if (freq >= 2 && freq <= 10) {
                            const perturbation = generatePerturbation(
                                blockX + x,
                                blockY + y,
                                perturbStrength,
                                seed + channel
                            );
                            dctBlock[y][x] += perturbation;
                        }
                    }
                }

                // Apply inverse DCT
                const perturbedBlock = idct2d(dctBlock);

                // Write back to result
                for (let y = 0; y < DCT_SIZE; y++) {
                    for (let x = 0; x < DCT_SIZE; x++) {
                        const imgX = blockX + x;
                        const imgY = blockY + y;
                        if (imgX < width && imgY < height) {
                            const idx = (imgY * width + imgX) * 4 + channel;
                            result[idx] = Math.max(0, Math.min(255, Math.round(perturbedBlock[y][x])));
                        }
                    }
                }
            }
        }
    }

    return new ImageData(result, width, height);
}

/**
 * Process an image file and apply perturbation
 */
export async function processImage(
    file: File | Blob,
    intensity: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Apply perturbation
            const perturbedData = applyFrequencyPerturbation(imageData, intensity);

            // Put back
            ctx.putImageData(perturbedData, 0, 0);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                'image/png',
                1.0
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Load image from URL and return as Blob
 */
export async function loadImageFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch image');
    }
    return response.blob();
}
