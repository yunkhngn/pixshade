import { motion } from 'framer-motion';
import { Image, Clock, FileOutput } from 'lucide-react';

interface PreviewBoxProps {
    imageUrl?: string;
    isProcessing?: boolean;
}

export function PreviewBox({ imageUrl, isProcessing = false }: PreviewBoxProps) {
    return (
        <motion.div
            className="w-full max-w-3xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <div className="bg-white rounded-2xl shadow-soft p-5">
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Preview thumbnail */}
                    <div className="flex-1">
                        <div className="aspect-video rounded-xl bg-cream border border-neutral-300/30 overflow-hidden flex items-center justify-center">
                            {imageUrl ? (
                                <motion.img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <div className="text-center text-neutral-400">
                                    <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Preview</p>
                                </div>
                            )}
                            {isProcessing && (
                                <motion.div
                                    className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                </motion.div>
                            )}
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
                                {imageUrl ? '~2.4 MB' : '—'}
                            </p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-cream">
                            <div className="flex items-center gap-2 text-neutral-400 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">Est. Time</span>
                            </div>
                            <p className="text-sm font-semibold text-neutral-600">
                                {imageUrl ? '~3 sec' : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
