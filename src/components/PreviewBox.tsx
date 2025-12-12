import { motion } from 'framer-motion';
import { Image, Clock, FileOutput, Download, ArrowRight } from 'lucide-react';

interface PreviewBoxProps {
    originalUrl?: string;
    protectedUrl?: string;
    isProcessing?: boolean;
    outputSize?: string;
    processingTime?: string;
    onDownload?: () => void;
}

export function PreviewBox({
    originalUrl,
    protectedUrl,
    isProcessing = false,
    outputSize,
    processingTime,
    onDownload,
}: PreviewBoxProps) {
    const hasImage = originalUrl || protectedUrl;

    return (
        <motion.div
            className="w-full max-w-3xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <div className="bg-white rounded-2xl shadow-soft p-5">
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Before/After Preview */}
                    <div className="flex-1">
                        <div className="flex gap-4">
                            {/* Original image */}
                            <div className="flex-1">
                                <p className="text-xs font-medium text-neutral-400 mb-2 text-center">
                                    Original
                                </p>
                                <div className="aspect-square rounded-xl bg-cream border border-neutral-300/30 overflow-hidden flex items-center justify-center relative">
                                    {originalUrl ? (
                                        <motion.img
                                            src={originalUrl}
                                            alt="Original"
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : (
                                        <div className="text-center text-neutral-400">
                                            <Image className="w-8 h-8 mx-auto opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-neutral-300" />
                            </div>

                            {/* Protected image */}
                            <div className="flex-1">
                                <p className="text-xs font-medium text-primary mb-2 text-center">
                                    Protected
                                </p>
                                <div className="aspect-square rounded-xl bg-cream border border-primary/30 overflow-hidden flex items-center justify-center relative">
                                    {protectedUrl ? (
                                        <motion.img
                                            src={protectedUrl}
                                            alt="Protected"
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : isProcessing ? (
                                        <div className="text-center text-primary">
                                            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="text-xs mt-2">Processing...</p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-neutral-400">
                                            <Image className="w-8 h-8 mx-auto opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info panel */}
                    <div className="md:w-48 flex flex-row md:flex-col gap-4">
                        <div className="flex-1 p-3 rounded-xl bg-cream">
                            <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                <FileOutput className="w-4 h-4" />
                                <span className="text-xs font-medium">Output Size</span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-600">
                                {outputSize || '—'}
                            </p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-cream">
                            <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">Processing Time</span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-600">
                                {processingTime || '—'}
                            </p>
                        </div>

                        {/* Download button */}
                        {onDownload && (
                            <motion.button
                                onClick={onDownload}
                                className="w-full p-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Info message when no image */}
                {!hasImage && (
                    <p className="text-center text-neutral-400 text-sm mt-4">
                        Select an image to see the before/after comparison
                    </p>
                )}
            </div>
        </motion.div>
    );
}
