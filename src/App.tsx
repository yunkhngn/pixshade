import { useState, useCallback, useRef } from 'react';
import {
  Header,
  DropzoneCard,
  ExampleChips,
  PreviewBox,
  FooterBar,
  SupportBanner,
} from './components';
import {
  protectImage,
  downloadProtectedImage,
  revokeProtectedUrl,
  formatFileSize,
  formatProcessingTime,
  type ProtectionResult,
} from './lib';
import './index.css';

function App() {
  const [intensity, setIntensity] = useState(50);
  const [metadataPoisoning, setMetadataPoisoning] = useState(true);

  // Original image state
  const [originalFile, setOriginalFile] = useState<File | Blob | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | undefined>();
  const originalFilename = useRef<string>('image');

  // Protected image state
  const [protectedResult, setProtectedResult] = useState<ProtectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File | string) => {
    // Cleanup previous URLs
    if (originalUrl && originalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(originalUrl);
    }
    if (protectedResult) {
      revokeProtectedUrl(protectedResult.url);
      setProtectedResult(null);
    }
    setError(null);

    if (file instanceof File) {
      originalFilename.current = file.name;
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
    } else {
      // URL string - fetch and load
      try {
        originalFilename.current = file.split('/').pop() || 'image';
        setOriginalUrl(file);
        const response = await fetch(file);
        const blob = await response.blob();
        setOriginalFile(blob);
      } catch {
        setError('Failed to load image from URL');
      }
    }
  }, [originalUrl, protectedResult]);

  const handleSelectExample = useCallback((exampleId: string) => {
    const exampleImages: Record<string, string> = {
      portrait: '/preview.jpg',
      landscape: '/preview.jpg',
      street: '/preview.jpg',
    };
    const url = exampleImages[exampleId] || '/preview.jpg';
    handleImageSelect(url);
  }, [handleImageSelect]);

  const handleProtect = useCallback(async () => {
    if (!originalFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await protectImage(originalFile, {
        intensity,
        metadataPoisoning,
      });

      // Cleanup previous protected URL
      if (protectedResult) {
        revokeProtectedUrl(protectedResult.url);
      }

      setProtectedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to protect image');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, intensity, metadataPoisoning, protectedResult]);

  const handleDownload = useCallback(() => {
    if (protectedResult) {
      downloadProtectedImage(protectedResult, originalFilename.current);
    }
  }, [protectedResult]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SupportBanner />
      <Header />

      <main className="px-4 pb-8 flex-1">
        <DropzoneCard
          onImageSelect={handleImageSelect}
          onProtect={handleProtect}
          intensity={intensity}
          onIntensityChange={setIntensity}
          metadataPoisoning={metadataPoisoning}
          onMetadataPoisoningChange={setMetadataPoisoning}
          isProcessing={isProcessing}
        />

        <ExampleChips onSelectExample={handleSelectExample} />

        {error && (
          <div className="max-w-3xl mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        <PreviewBox
          originalUrl={originalUrl}
          protectedUrl={protectedResult?.url}
          isProcessing={isProcessing}
          outputSize={protectedResult ? formatFileSize(protectedResult.size) : undefined}
          processingTime={protectedResult ? formatProcessingTime(protectedResult.processingTime) : undefined}
          onDownload={protectedResult ? handleDownload : undefined}
        />
      </main>

      <FooterBar onProtect={handleProtect} />
    </div>
  );
}

export default App;
