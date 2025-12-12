export interface WatermarkOptions {
    type: 'text' | 'image';
    text?: string;
    imageBitmap?: ImageBitmap;
    opacity: number;
    scale?: number;
    angle?: number;
    spacing?: number;
}

export function applyTiledWatermark(
    sourceData: ImageData,
    options: WatermarkOptions
): ImageData {
    const { width, height } = sourceData;
    const {
        type,
        text = '© PixShade',
        imageBitmap,
        opacity = 0.15,
        scale = 1.0,
        angle = -30,
        spacing = 50
    } = options;

    // Create canvas for the source image
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(sourceData, 0, 0);

    // Set global alpha for watermark
    ctx.globalAlpha = opacity;

    if (type === 'image' && imageBitmap) {
        // Tile the custom image watermark
        applyImageWatermark(ctx, imageBitmap, width, height, scale, angle, spacing);
    } else {
        // Use text watermark
        applyTextWatermark(ctx, text, width, height, scale, angle, spacing);
    }

    // Reset alpha
    ctx.globalAlpha = 1.0;

    return ctx.getImageData(0, 0, width, height);
}

/**
 * Apply a tiled image watermark
 */
function applyImageWatermark(
    ctx: OffscreenCanvasRenderingContext2D,
    imageBitmap: ImageBitmap,
    canvasWidth: number,
    canvasHeight: number,
    scale: number,
    angle: number,
    spacing: number
): void {
    const wmWidth = imageBitmap.width * scale;
    const wmHeight = imageBitmap.height * scale;

    // Calculate the diagonal to ensure we cover the entire canvas when rotated
    const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
    const tileWidth = wmWidth + spacing;
    const tileHeight = wmHeight + spacing;

    // Save context state
    ctx.save();

    // Move to center and rotate
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((angle * Math.PI) / 180);

    // Calculate start positions to cover the rotated area
    const startX = -diagonal / 2;
    const startY = -diagonal / 2;
    const endX = diagonal / 2;
    const endY = diagonal / 2;

    // Tile the watermark
    for (let y = startY; y < endY; y += tileHeight) {
        for (let x = startX; x < endX; x += tileWidth) {
            ctx.drawImage(imageBitmap, x, y, wmWidth, wmHeight);
        }
    }

    // Restore context state
    ctx.restore();
}

/**
 * Apply a tiled text watermark
 */
function applyTextWatermark(
    ctx: OffscreenCanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number,
    scale: number,
    angle: number,
    spacing: number
): void {
    // Calculate font size based on image dimensions
    const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.04 * scale;
    const fontSize = Math.max(12, Math.min(baseFontSize, 48));

    ctx.font = `bold ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure text
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width + spacing;
    const textHeight = fontSize + spacing;

    // Calculate the diagonal
    const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);

    // Save context state
    ctx.save();

    // Move to center and rotate
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((angle * Math.PI) / 180);

    // Calculate start positions
    const startX = -diagonal / 2;
    const startY = -diagonal / 2;
    const endX = diagonal / 2;
    const endY = diagonal / 2;

    // Tile the text with shadow for better visibility
    for (let y = startY; y < endY; y += textHeight) {
        for (let x = startX; x < endX; x += textWidth) {
            // Draw shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillText(text, x + 1, y + 1);
            // Draw text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(text, x, y);
        }
    }

    // Restore context state
    ctx.restore();
}
