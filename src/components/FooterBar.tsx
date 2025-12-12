import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart, Github, HelpCircle } from 'lucide-react';

interface FooterBarProps {
    onProtect?: () => void;
}

export function FooterBar({ onProtect }: FooterBarProps) {
    return (
        <motion.footer
            className="w-full py-6 sm:py-8 px-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Privacy note */}
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>
                            All processing runs in your browser. No upload involved.
                        </span>
                    </div>

                    {/* How it works link */}
                    <Link
                        to="/how-it-works"
                        className="flex items-center gap-2 text-neutral-400 hover:text-primary text-sm transition-colors"
                    >
                        <HelpCircle className="w-4 h-4" />
                        How it works
                    </Link>

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
