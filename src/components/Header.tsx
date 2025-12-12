import { Sparkles, Github, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const SparkleIcon = () => (
    <svg
        className="w-6 h-6 text-primary"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
);

export function Header() {
    return (
        <header className="w-full py-6 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Top bar with logo and icons */}
                <div className="flex items-center justify-between mb-8">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SparkleIcon />
                        <span className="text-2xl font-bold text-primary font-display">
                            PixShade
                        </span>
                    </motion.div>

                    {/* Right icons */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-neutral-300/30 transition-colors"
                            aria-label="View on GitHub"
                        >
                            <Github className="w-5 h-5 text-neutral-600" />
                        </a>
                        <button
                            className="p-2 rounded-full hover:bg-neutral-300/30 transition-colors"
                            aria-label="About PixShade"
                        >
                            <Info className="w-5 h-5 text-neutral-600" />
                        </button>
                    </motion.div>
                </div>

                {/* Headline section */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="relative inline-block mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-600 font-display">
                            Protect your images from{' '}
                            <span className="text-primary">AI training</span>
                        </h1>
                        {/* Decorative sparkles */}
                        <motion.div
                            className="absolute -top-2 -right-6 text-primary opacity-60"
                            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-1 -left-4 text-accent-lavender opacity-80"
                            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        >
                            <Sparkles className="w-4 h-4" />
                        </motion.div>
                    </div>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        PixShade runs fully in your browser using frequency-domain
                        perturbation and metadata obfuscation.
                    </p>
                </motion.div>
            </div>
        </header>
    );
}
