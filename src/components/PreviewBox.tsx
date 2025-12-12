import { motion } from 'framer-motion';
import { Image, Clock, FileOutput, Download, ArrowRight, ArrowDown } from 'lucide-react';

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
            className="w-full max-w-3xl mx-auto mt-4 sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:gap-5">
                    {/* Before/After Preview */}
                    <div className="flex-1">
                        {/* Mobile: Vertical layout */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {/* Original image */}
                            <div className="flex-1">
                                <p className="text-xs font-medium text-neutral-400 mb-2 text-center">
                                    Ảnh gốc
                                </p>
                                <div className="aspect-video sm:aspect-square rounded-xl bg-cream border border-neutral-300/30 overflow-hidden flex items-center justify-center relative">
                                    {originalUrl ? (
                                        <motion.img
                                            src={originalUrl}
                                            alt="Gốc"
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : (
                                        <div className="text-center text-neutral-400">
                                            <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arrow - different for mobile/desktop */}
                            <div className="flex items-center justify-center py-1 sm:py-0">
                                <ArrowDown className="w-5 h-5 text-neutral-300 sm:hidden" />
                                <ArrowRight className="w-5 h-5 text-neutral-300 hidden sm:block" />
                            </div>

                            {/* Protected image */}
                            <div className="flex-1">
                                <p className="text-xs font-medium text-primary mb-2 text-center">
                                    Đã bảo vệ
                                </p>
                                <div className="aspect-video sm:aspect-square rounded-xl bg-cream border border-primary/30 overflow-hidden flex items-center justify-center relative">
                                    {protectedUrl ? (
                                        <motion.img
                                            src={protectedUrl}
                                            alt="Đã bảo vệ"
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : isProcessing ? (
                                        <div className="text-center text-primary">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="text-xs mt-2">Đang xử lý...</p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-neutral-400">
                                            <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info panel - horizontal on mobile, vertical on desktop */}
                    <div className="flex flex-row sm:flex-row gap-3">
                        <div className="flex-1 p-2.5 sm:p-3 rounded-xl bg-cream">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 mb-0.5 sm:mb-1">
                                <FileOutput className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="text-xs font-medium">Kích thước</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-neutral-600">
                                {outputSize || '—'}
                            </p>
                        </div>
                        <div className="flex-1 p-2.5 sm:p-3 rounded-xl bg-cream">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 mb-0.5 sm:mb-1">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="text-xs font-medium">Thời gian</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-neutral-600">
                                {processingTime || '—'}
                            </p>
                        </div>

                        {/* Download button */}
                        {onDownload && (
                            <motion.button
                                onClick={onDownload}
                                className="flex-1 sm:flex-none p-2.5 sm:p-3 sm:px-6 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors text-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Tải về</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Info message when no image */}
                {!hasImage && (
                    <p className="text-center text-neutral-400 text-xs sm:text-sm mt-3 sm:mt-4">
                        Chọn một ảnh để xem so sánh trước và sau
                    </p>
                )}
            </div>
        </motion.div>
    );
}
