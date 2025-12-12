# PixShade Protection Worker

This directory contains the robust client-side image protection algorithms running in a WebWorker.

## Architecture

- **pixshadeWorker.ts**: Main entry point. Handles `postMessage` communication. 
- **dct.ts**: Core Multi-scale DCT implementation ($16, 8, 4$ scales) and Tiled Signature logic.
- **universal.ts**: Handles loading and applying Universal Perturbation Patterns.
- **metadata.ts**: Advanced XMP metadata injection.
- **utils.ts**: Helpers for PRNG (xoshiro128**) and PSNR calculation.
- **constants.ts**: Configuration constants.

## Worker API

### Input Message (`WorkerMessage`)

```typescript
{
  type: 'protect',
  imageBitmap: ImageBitmap, // Transferable
  mode: 'basic' | 'strong',
  seed?: string,
  options?: {
    alpha?: number,       // Intensity (0-100 baseline)
    density?: number,     // Density of blocks to perturb (0.0-1.0)
    lambda?: number,      // Strength for Universal Perturbation
    applyUniversal?: boolean, // Enable Universal Perturbation (Strong mode)
    patternUrl?: string   // URL to fetch pattern binary
  }
}
```

### Output Message (`WorkerResponse`)

```typescript
{
  type: 'done',
  blob: Blob, // Protected image as Blob (PNG)
  stats: {
    psnr: number,          // Quality metric (target >= 38dB)
    estimatedSize: number, // Output size in bytes
    processingTime: number,// Total time in ms
    stepsTimes: Record<string, number> // Breakdown
  }
}
```

## PSNR Tuning

The worker automatically attempts to maintain image quality:
- Target PSNR: **>= 38 dB**
- If PSNR is lower, it retries up to 2 times with reduced alpha (`alpha * 0.8`).

## Testing

Run unit tests via Vitest:
```bash
npm test
```
