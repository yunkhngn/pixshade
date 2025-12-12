import { motion } from 'framer-motion';
import { Shield, Lock, Coffee, Heart, Github } from 'lucide-react';

interface FooterBarProps {
    onProtect?: () => void;
}

export function FooterBar({ onProtect }: FooterBarProps) {
    return (
        <motion.footer
            className="w-full py-8 px-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Buy Me a Coffee prominent banner */}
                <motion.div
                    className="mb-6 p-4 bg-gradient-to-r from-[#FFDD00] to-[#FFB86B] rounded-2xl shadow-soft"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-neutral-800">
                            <Heart className="w-5 h-5 fill-current" />
                            <span className="font-medium">
                                If PixShade helped you, consider supporting the project!
                            </span>
                        </div>
                        <motion.a
                            href="https://buymeacoffee.com/yunkhngn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/90 hover:bg-white text-neutral-800 font-bold rounded-full shadow-md transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Coffee className="w-5 h-5" />
                            Buy me a coffee ☕
                        </motion.a>
                    </div>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Privacy note */}
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>
                            All processing runs in your browser. No upload involved.
                        </span>
                    </div>

                    {/* Secondary CTA */}
                    <motion.button
                        onClick={onProtect}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl shadow-soft flex items-center gap-2 transition-colors text-sm md:hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Shield className="w-4 h-4" />
                        Protect Image
                    </motion.button>
                </div>

                {/* Branding */}
                <div className="mt-6 text-center text-neutral-400 text-xs">
                    <p className="flex items-center justify-center gap-2 flex-wrap">
                        Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> by{' '}
                        <a
                            href="https://github.com/yunkhngn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                            <Github className="w-3 h-3" />
                            yunkhngn
                        </a>
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
