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

                {/* Step 1: Frequency Perturbation */}
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
                            1. Frequency-Domain Perturbation
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    What is DCT?
                                </h3>
                                <p className="text-neutral-500 mb-4">
                                    The Discrete Cosine Transform (DCT) converts your image from
                                    pixels into frequency components. This is the same technique
                                    used in JPEG compression.
                                </p>
                                <h3 className="text-lg font-semibold text-neutral-600 mb-3">
                                    How perturbation works
                                </h3>
                                <p className="text-neutral-500">
                                    We inject carefully calculated noise into the mid-frequency
                                    range of your image. This noise is:
                                </p>
                                <ul className="mt-3 space-y-2 text-neutral-500">
                                    <li className="flex items-start gap-2">
                                        <Eye className="w-5 h-5 text-accent-mint mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Invisible to humans</strong> - You won't notice
                                            any difference
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <EyeOff className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Confusing to AI</strong> - Disrupts pattern
                                            recognition
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Cpu className="w-5 h-5 text-accent-lavender mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Processed locally</strong> - No server upload
                                            required
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-cream rounded-xl p-6">
                                <div className="text-center mb-4">
                                    <span className="text-sm font-medium text-neutral-400">
                                        Perturbation Process
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-sm font-bold">
                                            1
                                        </div>
                                        <span className="text-neutral-600">
                                            Split image into 8×8 blocks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-sm font-bold">
                                            2
                                        </div>
                                        <span className="text-neutral-600">
                                            Apply 2D DCT transform
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                            3
                                        </div>
                                        <span className="text-neutral-600">
                                            Inject noise in mid-frequencies
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-300/50 flex items-center justify-center text-neutral-600 text-sm font-bold">
                                            4
                                        </div>
                                        <span className="text-neutral-600">
                                            Inverse DCT to reconstruct
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
                            AI scrapers often collect EXIF metadata (camera info, location,
                            date, etc.) along with images. We inject deliberately misleading
                            metadata to confuse data collection systems.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { label: 'Camera', value: 'Nokia 3310', icon: '📱' },
                                { label: 'Location', value: 'North Pole', icon: '📍' },
                                { label: 'Date', value: 'January 1, 1995', icon: '📅' },
                                { label: 'Software', value: 'MS Paint 3.11', icon: '🎨' },
                                { label: 'Copyright', value: 'Public Domain 1901', icon: '©️' },
                                { label: 'Artist', value: 'AI Generated', icon: '🤖' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="p-4 rounded-xl bg-cream border border-neutral-300/30"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{item.icon}</span>
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
                                    directly to your device.
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
