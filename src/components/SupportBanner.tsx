import { motion } from 'framer-motion';
import { Coffee, Heart } from 'lucide-react';

export function SupportBanner() {
    return (
        <motion.div
            className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFB86B] py-2.5 sm:py-3 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-neutral-800 text-sm sm:text-base">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="font-medium text-center">
                        <span className="hidden sm:inline">If PixShade helped you, consider supporting the project!</span>
                        <span className="sm:hidden">Nếu PixShade giúp bạn, hãy cân nhắc hỗ trợ dự án!</span>
                    </span>
                </div>
                <motion.a
                    href="https://buymeacoffee.com/yunkhngn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-1.5 sm:py-2 bg-white/90 hover:bg-white text-neutral-800 font-bold rounded-full shadow-md transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Coffee className="w-4 h-4" />
                    Buy me a coffee
                </motion.a>
            </div>
        </motion.div>
    );
}
