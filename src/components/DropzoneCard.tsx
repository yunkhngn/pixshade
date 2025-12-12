import { useState, useCallback, useRef } from 'react';
import { Upload, Link, Shield, Loader2, ImagePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropzoneCardProps {
    onImageSelect?: (file: File | File[] | string) => void;
    onProtect?: () => void;
    metadataPoisoning: boolean;
    onMetadataPoisoningChange: (value: boolean) => void;
    watermarkEnabled: boolean;
    onWatermarkEnabledChange: (value: boolean) => void;
    watermarkFile: File | null;
    onWatermarkFileChange: (file: File | null) => void;
    watermarkOpacity: number;
    onWatermarkOpacityChange: (value: number) => void;
    styleProtection: boolean;
    onStyleProtectionChange: (value: boolean) => void;
    isProcessing?: boolean;
    multiple?: boolean;
}

export function DropzoneCard({
    onImageSelect,
    onProtect,
    metadataPoisoning,
    onMetadataPoisoningChange,
    watermarkEnabled,
    onWatermarkEnabledChange,
    watermarkFile,
    onWatermarkFileChange,
    watermarkOpacity,
    onWatermarkOpacityChange,
    styleProtection,
    onStyleProtectionChange,
    isProcessing = false,
    multiple = false,
}: DropzoneCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const watermarkInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length > 0) {
                onImageSelect?.(multiple ? files : files[0]);
            }
        },
        [onImageSelect, multiple]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const fileArray = Array.from(files);
                onImageSelect?.(multiple ? fileArray : fileArray[0]);
            }
        },
        [onImageSelect, multiple]
    );

    const handleUrlSubmit = useCallback(() => {
        if (inputValue.trim()) {
            onImageSelect?.(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, onImageSelect]);

    const handleWatermarkUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && files[0].type === 'image/png') {
            onWatermarkFileChange(files[0]);
        }
    }, [onWatermarkFileChange]);

    return (
        <motion.div
            className="w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 md:p-8">
                {/* Dropzone area */}
                <motion.div
                    className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-200 ${isDragging
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-neutral-300 hover:border-primary/50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    animate={{ scale: isDragging ? 1.02 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple={multiple}
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload image file"
                    />
                    <div className="pointer-events-none">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                            animate={{ y: isDragging ? -5 : 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <Upload className="w-8 h-8 text-primary" />
                        </motion.div>
                        <p className="text-neutral-600 text-lg mb-2">
                            Kéo thả ảnh hoặc{' '}
                            <span className="text-primary font-medium">chọn từ máy</span>
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Hỗ trợ PNG, JPG, WebP tối đa 10MB
                        </p>
                    </div>
                </motion.div>

                {/* URL input */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="url"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Hoặc dán URL ảnh..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream border border-neutral-300/50 text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm sm:text-base"
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                    </div>
                    <motion.button
                        onClick={onProtect}
                        disabled={isProcessing}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 text-white font-semibold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-colors ${isProcessing
                            ? 'bg-primary/70 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-600'
                            }`}
                        whileHover={isProcessing ? {} : { scale: 1.02 }}
                        whileTap={isProcessing ? {} : { scale: 0.98 }}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Shield className="w-5 h-5" />
                        )}
                        {isProcessing ? 'Đang xử lý...' : 'Bảo vệ ngay'}
                    </motion.button>
                </div>

                {/* Controls row */}
                <div className="mt-8 flex flex-col gap-6">
                    {/* Row 1: Toggles */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Metadata toggle */}
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => onMetadataPoisoningChange(!metadataPoisoning)}
                                className={`relative w-12 h-7 rounded-full transition-colors ${metadataPoisoning ? 'bg-primary' : 'bg-neutral-300'
                                    }`}
                                role="switch"
                                aria-checked={metadataPoisoning}
                                aria-label="Toggle metadata poisoning"
                            >
                                <motion.div
                                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                                    animate={{ left: metadataPoisoning ? '1.375rem' : '0.125rem' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <div>
                                <span className="text-sm font-medium text-neutral-600">
                                    Metadata Poisoning
                                </span>
                                <p className="text-xs text-neutral-400">
                                    Tiêm dữ liệu EXIF giả
                                </p>
                            </div>
                        </div>

                        {/* Watermark toggle */}
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => onWatermarkEnabledChange(!watermarkEnabled)}
                                className={`relative w-12 h-7 rounded-full transition-colors ${watermarkEnabled ? 'bg-accent-mint' : 'bg-neutral-300'
                                    }`}
                                role="switch"
                                aria-checked={watermarkEnabled}
                                aria-label="Toggle watermark"
                            >
                                <motion.div
                                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                                    animate={{ left: watermarkEnabled ? '1.375rem' : '0.125rem' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <div>
                                <span className="text-sm font-medium text-neutral-600">
                                    Watermark chìm
                                </span>
                                <p className="text-xs text-neutral-400">
                                    Thêm hoạ tiết bảo vệ
                                </p>
                            </div>
                        </div>

                        {/* Style Protection toggle */}
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => onStyleProtectionChange(!styleProtection)}
                                className={`relative w-12 h-7 rounded-full transition-colors ${styleProtection ? 'bg-purple-500' : 'bg-neutral-300'
                                    }`}
                                role="switch"
                                aria-checked={styleProtection}
                                aria-label="Toggle style protection"
                            >
                                <motion.div
                                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                                    animate={{ left: styleProtection ? '1.375rem' : '0.125rem' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <div>
                                <span className="text-sm font-medium text-neutral-600">
                                    Chống sao chép
                                </span>
                                <p className="text-xs text-neutral-400">
                                    Bảo vệ style khỏi AI
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Watermark upload (shown when enabled) */}
                    {watermarkEnabled && (
                        <motion.div
                            className="p-4 rounded-xl bg-accent-mint/10 border border-accent-mint/30"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <p className="text-sm font-medium text-neutral-600 mb-3">
                                Upload watermark (PNG trong suốt)
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <input
                                    ref={watermarkInputRef}
                                    type="file"
                                    accept="image/png"
                                    onChange={handleWatermarkUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => watermarkInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-300 text-sm text-neutral-600 hover:border-primary transition-colors"
                                >
                                    <ImagePlus className="w-4 h-4" />
                                    Chọn file
                                </button>
                                {watermarkFile ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-accent-mint text-sm">
                                        <span className="text-neutral-600 truncate max-w-[150px]">
                                            {watermarkFile.name}
                                        </span>
                                        <button
                                            onClick={() => onWatermarkFileChange(null)}
                                            className="text-neutral-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-neutral-400">
                                        Hoặc dùng mặc định "© PixShade"
                                    </span>
                                )}
                            </div>

                            {/* Opacity slider */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Độ trong suốt
                                    </label>
                                    <span className="text-xs font-bold text-accent-mint">{watermarkOpacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={watermarkOpacity}
                                    onChange={(e) => onWatermarkOpacityChange(Number(e.target.value))}
                                    className="w-full accent-accent-mint"
                                    aria-label={`Độ trong suốt watermark: ${watermarkOpacity}%`}
                                />
                                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                    <span>Mờ hơn</span>
                                    <span>Rõ hơn</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
