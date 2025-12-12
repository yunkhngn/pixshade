import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Waves,
    FileWarning,
    Shield,
    Download,
    Eye,
    EyeOff,
    Cpu,
    Lock,
} from 'lucide-react';

export function HowItWorks() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="w-full py-6 px-4 md:px-8 border-b border-neutral-300/30">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to PixShade</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-600 font-display mb-4">
                        How <span className="text-primary">PixShade</span> Works
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Learn how we protect your images from AI training using advanced
                        frequency-domain perturbation and metadata obfuscation.
                    </p>
                </motion.div>

                {/* Step 1: Advanced Frequency Protection */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Waves className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            1. Advanced Frequency Protection
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    Multi-Scale DCT Perturbation
                                </h3>
                                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">
                                    We use a <strong>Multi-Scale Discrete Cosine Transform (DCT)</strong> approach
                                    to apply protective noise across various frequency bands. By operating on
                                    multiple scales (16x16, 8x8, and 4x4 blocks), we target both broad structures
                                    and fine details, making it significantly harder for AI models to reconstruct
                                    the original image features.
                                </p>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    Tiled Signature & Universal Patterns
                                </h3>
                                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">
                                    To resist template matching and removal attacks, we inject a
                                    <strong> deterministic tiled signature</strong> that shifts coefficients
                                    pseudo-randomly based on a secure seed. In 'Strong' mode, we also apply
                                    <strong> Universal Adversarial Perturbations</strong>—patterns specifically
                                    trained to disrupt common vision models.
                                </p>
                                <ul className="mt-4 space-y-2 text-neutral-500 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Eye className="w-4 h-4 text-accent-mint mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Perceptually Optimized</strong> - tuned to maintain
                                            high PSNR (&gt;38dB) visual quality.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <EyeOff className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Robust Against Resizing</strong> - Multi-scale noise
                                            survives downscaling better than standard noise.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-cream rounded-xl p-6">
                                <div className="text-center mb-4">
                                    <span className="text-sm font-medium text-neutral-400">
                                        The Protection Pipeline
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            1
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Apply Universal Perturbation (Strong Mode)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            2
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Multi-Scale DCT Decomposition (16/8/4)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                            3
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Mid-Freq Noise Injection & Tiled Shifts
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-xs font-bold">
                                            4
                                        </div>
                                        <span className="text-neutral-600 text-sm">
                                            Reconstruction & PSNR Quality Check
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Step 2: Metadata Poisoning */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-accent-lavender/50 flex items-center justify-center">
                            <FileWarning className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            2. Metadata Poisoning
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <p className="text-neutral-500 mb-6">
                            AI scrapers often collect EXIF and XMP metadata (camera info, location,
                            date, etc.) along with images. We use an <strong>Split XMP Injection</strong> technique
                            to distribute fake metadata across multiple chunks, making it harder to strip
                            programmatically while remaining valid for standard readers.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { label: 'Camera', value: 'Nokia 3310' },
                                { label: 'Location', value: 'North Pole' },
                                { label: 'Date', value: 'January 1, 1995' },
                                { label: 'Software', value: 'MS Paint 3.11' },
                                { label: 'Copyright', value: 'Public Domain 1901' },
                                { label: 'Artist', value: 'AI Generated' },
                            ].map((item, idx) => (
                                <div
                                    key={item.label}
                                    className="p-4 rounded-xl bg-cream border border-neutral-300/30"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs font-medium text-neutral-400">
                                            {item.label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-600">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Privacy Section */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-accent-mint/50 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-600">
                            Your Privacy Matters
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-mint/30 flex items-center justify-center">
                                    <Cpu className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    100% Client-Side
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    All processing happens in your browser. Your images never
                                    leave your device.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Shield className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    No Data Collection
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    We don't store, track, or collect any of your images or
                                    personal data.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-lavender/50 flex items-center justify-center">
                                    <Download className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-neutral-600 mb-2">
                                    Instant Download
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    Protected images are generated instantly and downloaded
                                    directly to your device. Supports 'Basic' and 'Strong' modes
                                    to balance speed and protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-2xl shadow-soft transition-colors text-lg"
                    >
                        <Shield className="w-6 h-6" />
                        Start Protecting Your Images
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
