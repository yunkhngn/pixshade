# PixShade

**Protect your images from AI training** — A browser-based tool using frequency-domain perturbation and metadata obfuscation.

## Features

- 🖼️ Drag-and-drop image upload
- 🎚️ Adjustable perturbation strength
- 🔒 Metadata poisoning toggle
- 🎨 Beautiful pastel UI design
- ⚡ Fully client-side processing

## Tech Stack

- **React 18** + TypeScript
- **Vite 7** for fast development
- **TailwindCSS 4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `cream` | `#FFF9F2` | Background |
| `primary` | `#FFB86B` | Primary actions, accents |
| `primary-600` | `#FF9F3B` | Hover states |
| `accent-mint` | `#D6F0E0` | Secondary accent |
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
│   ├── DropzoneCard.tsx   # Main card with dropzone
│   ├── ExampleChips.tsx   # Sample image buttons
│   ├── PreviewBox.tsx     # Image preview area
│   ├── FooterBar.tsx      # Privacy note, CTA
│   └── index.ts           # Barrel exports
├── App.tsx                # Main composition
└── index.css              # Tailwind config
```

## Integration

The UI is ready for algorithm integration. Key callbacks:

- `onImageSelect(file: File | string)` — Called when image is selected
- `onProtect()` — Called when Protect button is clicked
- State: `intensity`, `metadataPoisoning` — Available for processing

## License

MIT
