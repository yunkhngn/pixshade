import { useState, useCallback, useRef } from 'react';
import {
  Header,
  DropzoneCard,
  ExampleChips,
  PreviewBox,
  FooterBar,
  SupportBanner,
  PresetSelector,
  BatchProgress,
  QualityMetrics,
  type BatchFile,
} from './components';
import {
  protectImage,
  downloadProtectedImage,
  revokeProtectedUrl,
  formatFileSize,
  formatProcessingTime,
  createZipFromResults,
  downloadZip,
  PRESETS,
  DEFAULT_PRESET,
  type ProtectionResult,
  type PresetMode,
  type BatchResult,
} from './lib';
import './index.css';

function App() {
  // Preset mode
  const [presetMode, setPresetMode] = useState<PresetMode>(DEFAULT_PRESET);

  // Options (auto-set by preset, but can be customized)
  const [metadataPoisoning, setMetadataPoisoning] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(15);
  const [styleProtection, setStyleProtection] = useState(false);

  // Batch files state
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);

  // Single image state (for preview)
  const [originalUrl, setOriginalUrl] = useState<string | undefined>();
  const [protectedResult, setProtectedResult] = useState<ProtectionResult | null>(null);
  const originalFilename = useRef<string>('image');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Handle file selection (single or multiple)
  const handleImageSelect = useCallback(async (files: File | File[] | string) => {
    setError(null);

    // Cleanup previous states
    if (originalUrl && originalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(originalUrl);
    }
    if (protectedResult) {
      revokeProtectedUrl(protectedResult.url);
      setProtectedResult(null);
    }
    setBatchResults([]);

    // Handle URL string (single image)
    if (typeof files === 'string') {
      try {
        originalFilename.current = files.split('/').pop() || 'image';
        setOriginalUrl(files);
        const response = await fetch(files);
        const blob = await response.blob();
        const file = new File([blob], originalFilename.current, { type: blob.type });
        setBatchFiles([{ id: generateId(), file, status: 'pending', progress: 0 }]);
      } catch {
        setError('Không thể tải ảnh từ URL');
      }
      return;
    }

    // Handle single File
    if (files instanceof File) {
      files = [files];
    }

    // Handle multiple files
    const newBatchFiles: BatchFile[] = files.map(file => ({
      id: generateId(),
      file,
      status: 'pending',
      progress: 0,
    }));

    setBatchFiles(newBatchFiles);

    // Set preview for first image
    if (newBatchFiles.length > 0) {
      originalFilename.current = newBatchFiles[0].file.name;
      setOriginalUrl(URL.createObjectURL(newBatchFiles[0].file));
    }
  }, [originalUrl, protectedResult]);

  // Handle example selection
  const handleSelectExample = useCallback((exampleId: string) => {
    const exampleImages: Record<string, string> = {
      portrait: '/bocchi.jpg',
      landscape: '/frieren.jpg',
      street: '/thang-ngot.jpg',
    };
    const url = exampleImages[exampleId] || '/bocchi.jpg';
    handleImageSelect(url);
  }, [handleImageSelect]);

  // Remove file from batch
  const handleRemoveFile = useCallback((id: string) => {
    setBatchFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Handle preset change
  const handlePresetChange = useCallback((preset: PresetMode) => {
    setPresetMode(preset);
    // Optionally auto-set watermark opacity based on preset
    setWatermarkOpacity(Math.round(PRESETS[preset].watermarkOpacity * 100));
  }, []);

  // Process all images
  const handleProtect = useCallback(async () => {
    if (batchFiles.length === 0) {
      setError('Vui lòng chọn ảnh trước');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setBatchResults([]);

    const preset = PRESETS[presetMode];
    const results: BatchResult[] = [];

    // Prepare watermark bitmap once
    let watermarkBitmap: ImageBitmap | undefined;
    if (watermarkEnabled && watermarkFile) {
      watermarkBitmap = await createImageBitmap(watermarkFile);
    }

    try {
      for (let i = 0; i < batchFiles.length; i++) {
        const batchFile = batchFiles[i];

        // Update status to processing
        setBatchFiles(prev => prev.map(f =>
          f.id === batchFile.id ? { ...f, status: 'processing', progress: 10 } : f
        ));

        try {
          // Clone watermark bitmap for each image if using image watermark
          let wmBitmap = watermarkBitmap;
          if (watermarkEnabled && watermarkFile && i > 0) {
            wmBitmap = await createImageBitmap(watermarkFile);
          }

          const result = await protectImage(batchFile.file, {
            intensity: preset.intensity,
            metadataPoisoning,
            watermark: watermarkEnabled ? {
              enabled: true,
              type: watermarkFile ? 'image' : 'text',
              imageBitmap: wmBitmap,
              opacity: watermarkOpacity / 100,
              scale: 0.5,
            } : undefined,
            styleProtection: styleProtection ? {
              enableColorShift: true,
              enableEdgeDisruption: true,
              enableTextureConfusion: true,
            } : undefined,
          });

          results.push({ filename: batchFile.file.name, result });

          // Update status to done
          setBatchFiles(prev => prev.map(f =>
            f.id === batchFile.id ? { ...f, status: 'done', progress: 100 } : f
          ));

          // Update preview with first result
          if (i === 0) {
            setProtectedResult(result);
          }

        } catch (err) {
          // Update status to error
          setBatchFiles(prev => prev.map(f =>
            f.id === batchFile.id ? {
              ...f,
              status: 'error',
              progress: 0,
              error: err instanceof Error ? err.message : 'Lỗi xử lý'
            } : f
          ));
        }
      }

      setBatchResults(results);

    } finally {
      setIsProcessing(false);
    }
  }, [batchFiles, presetMode, metadataPoisoning, watermarkEnabled, watermarkFile, watermarkOpacity]);

  // Download single or ZIP
  const handleDownload = useCallback(async () => {
    if (batchResults.length === 0 && protectedResult) {
      downloadProtectedImage(protectedResult, originalFilename.current);
    } else if (batchResults.length === 1) {
      downloadProtectedImage(batchResults[0].result, batchResults[0].filename);
    } else if (batchResults.length > 1) {
      // Download as ZIP
      const zipBlob = await createZipFromResults(batchResults);
      downloadZip(zipBlob);
    }
  }, [batchResults, protectedResult]);

  const completedCount = batchFiles.filter(f => f.status === 'done').length;
  const hasResults = batchResults.length > 0 || protectedResult !== null;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SupportBanner />
      <Header />

      <main className="px-4 pb-8 flex-1">
        <DropzoneCard
          onImageSelect={handleImageSelect}
          onProtect={handleProtect}
          metadataPoisoning={metadataPoisoning}
          onMetadataPoisoningChange={setMetadataPoisoning}
          watermarkEnabled={watermarkEnabled}
          onWatermarkEnabledChange={setWatermarkEnabled}
          watermarkFile={watermarkFile}
          onWatermarkFileChange={setWatermarkFile}
          watermarkOpacity={watermarkOpacity}
          onWatermarkOpacityChange={setWatermarkOpacity}
          styleProtection={styleProtection}
          onStyleProtectionChange={setStyleProtection}
          isProcessing={isProcessing}
          multiple={true}
        />

        {/* Preset Selector */}
        <div className="max-w-3xl mx-auto mt-6">
          <PresetSelector
            value={presetMode}
            onChange={handlePresetChange}
            disabled={isProcessing}
          />
        </div>

        {/* Batch Progress */}
        <div className="max-w-3xl mx-auto">
          <BatchProgress
            files={batchFiles}
            onRemove={handleRemoveFile}
            onSelect={setSelectedFileId}
            selectedId={selectedFileId || undefined}
            isProcessing={isProcessing}
          />
        </div>

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
          onDownload={hasResults ? handleDownload : undefined}
          downloadLabel={batchResults.length > 1 ? `Tải ZIP (${completedCount} ảnh)` : undefined}
        />

        {/* Quality Metrics */}
        {protectedResult && (
          <div className="max-w-3xl mx-auto">
            <QualityMetrics
              psnr={protectedResult.psnr}
              ssim={protectedResult.ssim}
              processingTime={protectedResult.processingTime}
              size={protectedResult.size}
            />
          </div>
        )}
      </main>

      <FooterBar onProtect={handleProtect} />
    </div>
  );
}

export default App;
