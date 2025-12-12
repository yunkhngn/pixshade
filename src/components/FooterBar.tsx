import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

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
                    <p>
                        Made with ❤️ for creators •{' '}
                        <a href="#" className="hover:text-primary transition-colors">
                            How it works
                        </a>
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
