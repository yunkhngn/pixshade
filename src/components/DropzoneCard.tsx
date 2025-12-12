import { useState, useCallback } from 'react';
import { Upload, Link, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropzoneCardProps {
    onImageSelect?: (file: File | string) => void;
    onProtect?: () => void;
    intensity: number;
    onIntensityChange: (value: number) => void;
    metadataPoisoning: boolean;
    onMetadataPoisoningChange: (value: boolean) => void;
    isProcessing?: boolean;
}

export function DropzoneCard({
    onImageSelect,
    onProtect,
    intensity,
    onIntensityChange,
    metadataPoisoning,
    onMetadataPoisoningChange,
    isProcessing = false,
}: DropzoneCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [inputValue, setInputValue] = useState('');

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
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                onImageSelect?.(files[0]);
            }
        },
        [onImageSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onImageSelect?.(files[0]);
            }
        },
        [onImageSelect]
    );

    const handleUrlSubmit = useCallback(() => {
        if (inputValue.trim()) {
            onImageSelect?.(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, onImageSelect]);

    return (
        <motion.div
            className="w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                {/* Dropzone area */}
                <motion.div
                    className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200 ${isDragging
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
                            Drop an image or{' '}
                            <span className="text-primary font-medium">browse</span>
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Supports PNG, JPG, WebP up to 10MB
                        </p>
                    </div>
                </motion.div>

                {/* URL input */}
                <div className="mt-6 flex gap-3">
                    <div className="flex-1 relative">
                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="url"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Or paste an image URL..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream border border-neutral-300/50 text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                    </div>
                    <motion.button
                        onClick={onProtect}
                        disabled={isProcessing}
                        className={`px-8 py-3 text-white font-semibold rounded-xl shadow-soft flex items-center gap-2 transition-colors ${isProcessing
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
                        {isProcessing ? 'Processing...' : 'Protect'}
                    </motion.button>
                </div>

                {/* Controls row */}
                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Intensity slider */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-neutral-600">
                                Perturbation strength
                            </label>
                            <span className="text-sm font-bold text-primary">{intensity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={intensity}
                            onChange={(e) => onIntensityChange(Number(e.target.value))}
                            className="w-full"
                            aria-label={`Perturbation strength: ${intensity}%`}
                        />
                    </div>

                    {/* Metadata toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onMetadataPoisoningChange(!metadataPoisoning)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${metadataPoisoning ? 'bg-primary' : 'bg-neutral-300'
                                }`}
                            role="switch"
                            aria-checked={metadataPoisoning}
                            aria-label="Toggle metadata poisoning"
                        >
                            <motion.div
                                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                                animate={{ left: metadataPoisoning ? '1.75rem' : '0.25rem' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <div>
                            <span className="text-sm font-medium text-neutral-600">
                                Metadata Poisoning
                            </span>
                            <p className="text-xs text-neutral-400">
                                Inject misleading EXIF data
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
