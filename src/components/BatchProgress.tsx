import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useMemo } from 'react';

export type FileStatus = 'pending' | 'processing' | 'done' | 'error';

export interface BatchFile {
    id: string;
    file: File;
    status: FileStatus;
    progress: number;
    error?: string;
}

interface BatchProgressProps {
    files: BatchFile[];
    onRemove?: (id: string) => void;
    isProcessing: boolean;
}

// Thumbnail component with memoized URL
function FileThumbnail({ file }: { file: File }) {
    const thumbnailUrl = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <img
            src={thumbnailUrl}
            alt={file.name}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
            onLoad={() => URL.revokeObjectURL(thumbnailUrl)}
        />
    );
}

export function BatchProgress({ files, onRemove, isProcessing }: BatchProgressProps) {
    if (files.length === 0) return null;

    const completedCount = files.filter(f => f.status === 'done').length;
    const totalProgress = files.length > 0
        ? Math.round(files.reduce((acc, f) => acc + f.progress, 0) / files.length)
        : 0;

    return (
        <div className="mt-4 p-4 bg-cream rounded-xl border border-neutral-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-neutral-600">
                    {isProcessing
                        ? `Đang xử lý... ${completedCount}/${files.length}`
                        : `${files.length} ảnh đã chọn`
                    }
                </span>
                {isProcessing && (
                    <span className="text-xs font-bold text-primary">{totalProgress}%</span>
                )}
            </div>

            {/* Overall progress bar */}
            {isProcessing && (
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            )}

            {/* File list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file) => (
                    <motion.div
                        key={file.id}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        {/* Thumbnail */}
                        <FileThumbnail file={file.file} />

                        {/* File info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-600 truncate">
                                {file.file.name}
                            </p>
                            {file.status === 'processing' && (
                                <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mt-1">
                                    <motion.div
                                        className="h-full bg-primary"
                                        animate={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            )}
                            {file.error && (
                                <p className="text-xs text-red-500 truncate">{file.error}</p>
                            )}
                        </div>

                        {/* Status icon */}
                        <div className="flex-shrink-0">
                            {file.status === 'pending' && !isProcessing && onRemove && (
                                <button
                                    onClick={() => onRemove(file.id)}
                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            )}
                            {file.status === 'processing' && (
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            )}
                            {file.status === 'done' && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {file.status === 'error' && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
