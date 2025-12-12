import { useState, useCallback } from 'react';
import {
  Header,
  DropzoneCard,
  ExampleChips,
  PreviewBox,
  FooterBar,
} from './components';
import './index.css';

function App() {
  const [intensity, setIntensity] = useState(50);
  const [metadataPoisoning, setMetadataPoisoning] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const handleImageSelect = useCallback((file: File | string) => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(file);
    }
  }, []);

  const handleSelectExample = useCallback((exampleId: string) => {
    // Load example images - for now using placeholder
    const exampleImages: Record<string, string> = {
      portrait: '/preview.jpg',
      landscape: '/preview.jpg',
      street: '/preview.jpg',
    };
    setPreviewUrl(exampleImages[exampleId] || '/preview.jpg');
  }, []);

  const handleProtect = useCallback(() => {
    // Placeholder for protection logic - will be wired later
    console.log('Protecting image with:', {
      intensity,
      metadataPoisoning,
      previewUrl,
    });
  }, [intensity, metadataPoisoning, previewUrl]);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="px-4 pb-8">
        <DropzoneCard
          onImageSelect={handleImageSelect}
          onProtect={handleProtect}
          intensity={intensity}
          onIntensityChange={setIntensity}
          metadataPoisoning={metadataPoisoning}
          onMetadataPoisoningChange={setMetadataPoisoning}
        />

        <ExampleChips onSelectExample={handleSelectExample} />

        <PreviewBox imageUrl={previewUrl} />
      </main>

      <FooterBar onProtect={handleProtect} />
    </div>
  );
}

export default App;
