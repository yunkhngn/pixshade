import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';

interface QualityMetricsProps {
    psnr?: number;
    ssim?: number;
    processingTime?: number;
    size?: number;
}

function getPSNRStatus(psnr: number): { label: string; color: string; icon: typeof CheckCircle } {
    if (psnr >= 45) return { label: 'Xuất sắc', color: 'text-green-500', icon: CheckCircle };
    if (psnr >= 40) return { label: 'Rất tốt', color: 'text-green-500', icon: CheckCircle };
    if (psnr >= 35) return { label: 'Tốt', color: 'text-yellow-500', icon: CheckCircle };
    return { label: 'Trung bình', color: 'text-orange-500', icon: AlertTriangle };
}

function getSSIMStatus(ssim: number): { label: string; color: string } {
    if (ssim >= 0.98) return { label: 'Gần như hoàn hảo', color: 'text-green-500' };
    if (ssim >= 0.95) return { label: 'Rất cao', color: 'text-green-500' };
    if (ssim >= 0.90) return { label: 'Cao', color: 'text-yellow-500' };
    return { label: 'Trung bình', color: 'text-orange-500' };
}

export function QualityMetrics({ psnr, ssim, processingTime, size }: QualityMetricsProps) {
    if (psnr === undefined && ssim === undefined) return null;

    const psnrStatus = psnr ? getPSNRStatus(psnr) : null;
    const ssimStatus = ssim ? getSSIMStatus(ssim) : null;

    return (
        <motion.div
            className="mt-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-soft"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-neutral-600">Chất lượng bảo vệ</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* PSNR */}
                {psnr !== undefined && (
                    <div className="p-3 bg-cream rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-neutral-400">PSNR</span>
                            {psnrStatus && (
                                <span className={`text-xs font-medium ${psnrStatus.color}`}>
                                    {psnrStatus.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-neutral-700">
                                {psnr === Infinity ? '∞' : psnr.toFixed(1)}
                            </span>
                            <span className="text-xs text-neutral-400">dB</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-green-400 to-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((psnr / 50) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* SSIM */}
                {ssim !== undefined && (
                    <div className="p-3 bg-cream rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-neutral-400">SSIM</span>
                            {ssimStatus && (
                                <span className={`text-xs font-medium ${ssimStatus.color}`}>
                                    {ssimStatus.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-neutral-700">
                                {(ssim * 100).toFixed(1)}
                            </span>
                            <span className="text-xs text-neutral-400">%</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${ssim * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Additional info */}
            {(processingTime || size) && (
                <div className="mt-3 pt-3 border-t border-neutral-200 flex gap-4 text-xs text-neutral-400">
                    {processingTime && (
                        <span>Thời gian: {(processingTime / 1000).toFixed(2)}s</span>
                    )}
                    {size && (
                        <span>Kích thước: {(size / 1024).toFixed(1)} KB</span>
                    )}
                </div>
            )}
        </motion.div>
    );
}
