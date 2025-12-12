import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Flame } from 'lucide-react';
import { PRESETS, type PresetMode } from '../lib/presets';

interface PresetSelectorProps {
    value: PresetMode;
    onChange: (preset: PresetMode) => void;
    disabled?: boolean;
}

const PRESET_ICONS: Record<PresetMode, typeof Shield> = {
    light: Shield,
    standard: Zap,
    maximum: Flame,
};

const PRESET_COLORS: Record<PresetMode, { bg: string; border: string; dot: string }> = {
    light: { bg: 'bg-accent-mint/30', border: 'border-accent-mint', dot: 'bg-green-500' },
    standard: { bg: 'bg-primary/20', border: 'border-primary', dot: 'bg-primary' },
    maximum: { bg: 'bg-red-100', border: 'border-red-400', dot: 'bg-red-500' },
};

export function PresetSelector({ value, onChange, disabled }: PresetSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-600">
                Chế độ bảo vệ
            </label>
            <div className="grid grid-cols-3 gap-2 relative">
                {(Object.keys(PRESETS) as PresetMode[]).map((preset) => {
                    const config = PRESETS[preset];
                    const Icon = PRESET_ICONS[preset];
                    const isSelected = value === preset;
                    const colors = PRESET_COLORS[preset];

                    return (
                        <motion.button
                            key={preset}
                            onClick={() => onChange(preset)}
                            disabled={disabled}
                            className={`relative p-3 rounded-xl border-2 text-left overflow-hidden ${isSelected
                                    ? `${colors.bg} ${colors.border}`
                                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            whileHover={disabled ? {} : { scale: 1.02 }}
                            whileTap={disabled ? {} : { scale: 0.98 }}
                            layout
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                            {/* Selection background animation */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        className={`absolute inset-0 ${colors.bg}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </AnimatePresence>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <motion.div
                                        animate={{
                                            scale: isSelected ? 1.1 : 1,
                                            rotate: isSelected ? [0, -10, 10, 0] : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`} />
                                    </motion.div>
                                    <span className={`text-sm font-semibold ${isSelected ? 'text-neutral-700' : 'text-neutral-500'}`}>
                                        {config.labelVi}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 line-clamp-2">
                                    {config.descriptionVi}
                                </p>
                            </div>

                            {/* Selection indicator dot */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${colors.dot}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
