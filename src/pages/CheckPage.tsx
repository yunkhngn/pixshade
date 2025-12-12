import { useState, useCallback } from 'react';
import { Upload, CheckCircle, XCircle, AlertTriangle, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckResult {
    isProtected: boolean;
    confidence: number;
    details: {
        metadataCheck: boolean;
        frequencyCheck: boolean;
        noiseCheck: boolean;
    };
}

export function CheckPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<CheckResult | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
            setPreviewUrl(URL.createObjectURL(droppedFile));
            setResult(null);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    }, []);

    const checkProtection = useCallback(async () => {
        if (!file) return;

        setIsChecking(true);

        try {
            // Create image bitmap for analysis
            const bitmap = await createImageBitmap(file);
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(bitmap, 0, 0);
            const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
            const data = imageData.data;

            // 1. Check for high-frequency noise patterns (HF injection signature)
            let noiseScore = 0;
            let alternatingCount = 0;
            const sampleSize = Math.min(3000, bitmap.width * bitmap.height);

            for (let i = 0; i < sampleSize; i++) {
                const x = Math.floor(Math.random() * (bitmap.width - 2)) + 1;
                const y = Math.floor(Math.random() * (bitmap.height - 2)) + 1;
                const idx = (y * bitmap.width + x) * 4;
                const prevIdx = ((y - 1) * bitmap.width + (x - 1)) * 4;

                const diff = Math.abs(data[idx] - data[prevIdx]) +
                    Math.abs(data[idx + 1] - data[prevIdx + 1]) +
                    Math.abs(data[idx + 2] - data[prevIdx + 2]);
                noiseScore += diff;

                // Check for alternating pattern (HF injection signature)
                const current = data[idx];
                const right = data[(y * bitmap.width + (x + 1)) * 4];
                const below = data[((y + 1) * bitmap.width + x) * 4];
                if ((current > right && current > below) || (current < right && current < below)) {
                    alternatingCount++;
                }
            }
            noiseScore = noiseScore / sampleSize / 3;
            const noiseCheck = noiseScore > 12 && alternatingCount > sampleSize * 0.35;

            // 2. Check for frequency domain anomalies (DCT perturbation signature)
            let frequencyScore = 0;
            let highVarBlocks = 0;
            const blockSize = 8;
            const numBlocks = Math.min(25, Math.floor(bitmap.height / blockSize)) *
                Math.min(25, Math.floor(bitmap.width / blockSize));

            for (let by = 0; by < Math.min(25, Math.floor(bitmap.height / blockSize)); by++) {
                for (let bx = 0; bx < Math.min(25, Math.floor(bitmap.width / blockSize)); bx++) {
                    let blockVariance = 0;
                    let blockMean = 0;

                    for (let wy = 0; wy < blockSize; wy++) {
                        for (let wx = 0; wx < blockSize; wx++) {
                            const idx = ((by * blockSize + wy) * bitmap.width + (bx * blockSize + wx)) * 4;
                            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                            blockMean += gray;
                        }
                    }
                    blockMean /= (blockSize * blockSize);

                    for (let wy = 0; wy < blockSize; wy++) {
                        for (let wx = 0; wx < blockSize; wx++) {
                            const idx = ((by * blockSize + wy) * bitmap.width + (bx * blockSize + wx)) * 4;
                            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                            blockVariance += Math.pow(gray - blockMean, 2);
                        }
                    }
                    blockVariance = Math.sqrt(blockVariance / (blockSize * blockSize));
                    frequencyScore += blockVariance;

                    if (blockVariance > 25) highVarBlocks++;
                }
            }
            frequencyScore = frequencyScore / numBlocks;
            const frequencyCheck = frequencyScore > 20 || highVarBlocks > numBlocks * 0.25;

            // 3. Check for gradient perturbation signature
            let gradientAnomalyScore = 0;
            for (let i = 0; i < Math.min(2000, (bitmap.width - 2) * (bitmap.height - 2)); i++) {
                const x = Math.floor(Math.random() * (bitmap.width - 2)) + 1;
                const y = Math.floor(Math.random() * (bitmap.height - 2)) + 1;
                const idx = (y * bitmap.width + x) * 4;

                // Check perpendicular gradient anomaly
                const left = data[(y * bitmap.width + (x - 1)) * 4];
                const right = data[(y * bitmap.width + (x + 1)) * 4];
                const above = data[((y - 1) * bitmap.width + x) * 4];
                const below = data[((y + 1) * bitmap.width + x) * 4];

                const hGrad = Math.abs(right - left);
                const vGrad = Math.abs(below - above);

                // Gradient perturbation adds noise perpendicular to gradients
                if (hGrad > 10 || vGrad > 10) {
                    const perpNoise = Math.abs(data[idx] - (left + right) / 2) +
                        Math.abs(data[idx] - (above + below) / 2);
                    gradientAnomalyScore += perpNoise;
                }
            }
            gradientAnomalyScore = gradientAnomalyScore / 2000;
            const metadataCheck = gradientAnomalyScore > 8;

            // Calculate overall confidence
            const checks = [metadataCheck, frequencyCheck, noiseCheck];
            const passedChecks = checks.filter(Boolean).length;
            const confidence = passedChecks / checks.length;
            const isProtected = passedChecks >= 2; // Require 2 out of 3

            setResult({
                isProtected,
                confidence,
                details: {
                    metadataCheck,
                    frequencyCheck,
                    noiseCheck,
                },
            });
        } catch (error) {
            console.error('Check failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, [file]);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Upload Area */}
            <motion.div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-300 bg-white'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {previewUrl ? (
                    <div className="text-center">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-xl shadow-md mb-4"
                        />
                        <p className="text-sm text-neutral-500">{file?.name}</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-neutral-600 font-medium mb-2">
                            Kéo thả ảnh hoặc click để chọn
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Kiểm tra xem ảnh đã được bảo vệ bởi PixShade chưa
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Check Button */}
            {file && !isChecking && (
                <motion.button
                    onClick={checkProtection}
                    className="w-full mt-4 py-3 bg-primary text-white font-semibold rounded-xl shadow-soft hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Search className="w-5 h-5" />
                    Kiểm tra Protection
                </motion.button>
            )}

            {/* Loading */}
            {isChecking && (
                <motion.div
                    className="mt-4 p-4 bg-neutral-100 rounded-xl flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-neutral-600">Đang phân tích ảnh...</span>
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Main Result */}
                        <div className={`p-6 rounded-2xl border-2 ${result.isProtected
                            ? 'bg-green-50 border-green-200'
                            : 'bg-amber-50 border-amber-200'
                            }`}>
                            <div className="flex items-center gap-4">
                                {result.isProtected ? (
                                    <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center">
                                        <AlertTriangle className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                <div>
                                    <h3 className={`text-xl font-bold ${result.isProtected ? 'text-green-700' : 'text-amber-700'
                                        }`}>
                                        {result.isProtected ? 'Đã được bảo vệ!' : 'Chưa được bảo vệ'}
                                    </h3>
                                    <p className={`text-sm ${result.isProtected ? 'text-green-600' : 'text-amber-600'
                                        }`}>
                                        Độ tin cậy: {Math.round(result.confidence * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detail Checks */}
                        <div className="mt-4 p-4 bg-white rounded-xl border border-neutral-200">
                            <h4 className="font-semibold text-neutral-700 mb-3">Chi tiết kiểm tra</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'Pattern Signature', passed: result.details.metadataCheck },
                                    { label: 'Frequency Anomaly', passed: result.details.frequencyCheck },
                                    { label: 'Noise Detection', passed: result.details.noiseCheck },
                                ].map((check) => (
                                    <div key={check.label} className="flex items-center gap-3">
                                        {check.passed ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-neutral-300" />
                                        )}
                                        <span className={check.passed ? 'text-neutral-700' : 'text-neutral-400'}>
                                            {check.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
