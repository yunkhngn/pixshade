# PixShade

**Protect your images from AI training** — A browser-based tool using Multi-Scale DCT perturbation and metadata obfuscation.

## Features

- **Drag-and-drop** or paste image URL
- **Multi-Scale DCT Perturbation** - Add frequency-domain noise to disrupt AI
- **Tiled Signature** - Deterministic digital signature for image authentication
- **Metadata Poisoning** - Inject fake EXIF/XMP data
- **Subtle Watermark** - Semi-transparent protective pattern (optional)
  - Upload your own transparent PNG
  - Adjustable opacity (5-50%)
  - Default: "© PixShade" text
- Beautiful pastel UI design
- **100% Client-side** - No server uploads

## Tech Stack

- **React 18** + TypeScript
- **Vite 7** for fast development
- **TailwindCSS 4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Web Workers** for non-blocking processing

## Protection Pipeline

1. **Universal Perturbation** (Strong mode) - Adversarial pattern overlay
2. **Multi-Scale DCT** - 16×16, 8×8, 4×4 block processing
3. **Tiled Signature** - Deterministic mid-frequency patterns
4. **Watermark** (Optional) - Semi-transparent tiled pattern
5. **Split XMP Injection** - Fragmented metadata poisoning

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `cream` | `#FFF9F2` | Background |
| `primary` | `#FFB86B` | Primary actions, accents |
| `primary-600` | `#FF9F3B` | Hover states |
| `accent-mint` | `#D6F0E0` | Secondary accent (Watermark) |
| `accent-lavender` | `#F3D8F3` | Tertiary accent |
| `neutral-600` | `#4B5563` | Body text |

### Typography

- **Display**: Poppins (headings)
- **Body**: Inter (text, UI)

### Shadows

- `shadow-soft`: Subtle card elevation
- `shadow-card`: Main card shadow
- `shadow-glow`: Interactive glow effects

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Logo, headline, nav
│   ├── DropzoneCard.tsx   # Main card with dropzone + controls
│   ├── ExampleChips.tsx   # Sample image buttons
│   ├── PreviewBox.tsx     # Before/after preview
│   ├── FooterBar.tsx      # Privacy note, CTA
│   ├── SupportBanner.tsx  # Buy me a coffee banner
│   └── index.ts           # Barrel exports
├── worker/
│   ├── pixshadeWorker.ts  # Main worker entry
│   ├── dct.ts             # DCT perturbation algorithms
│   ├── watermark.ts       # Tiled watermark rendering
│   ├── metadata.ts        # XMP injection
│   ├── universal.ts       # Universal perturbation
│   └── utils.ts           # PRNG, PSNR calculation
├── lib/
│   └── protection.ts      # Protection service API
├── pages/
│   └── HowItWorks.tsx     # Algorithm documentation
├── App.tsx                # Main composition
└── index.css              # Tailwind config
```

## API

```typescript
interface ProtectionOptions {
  intensity: number;        // 0-100
  metadataPoisoning: boolean;
  watermark?: {
    enabled: boolean;
    type: 'text' | 'image';
    imageBitmap?: ImageBitmap;
    opacity?: number;       // 0.0-1.0
    scale?: number;
  };
}

const result = await protectImage(file, options);
// result: { blob, url, size, processingTime, psnr }
```

## License

MIT © [yunkhngn](https://github.com/yunkhngn)


