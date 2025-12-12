/**
 * Protection Preset Modes
 * Defines intensity levels for different protection strengths
 */

export type PresetMode = 'light' | 'standard' | 'maximum';

export interface PresetConfig {
    label: string;
    labelVi: string;
    description: string;
    descriptionVi: string;
    intensity: number;
    watermarkOpacity: number;
}

export const PRESETS: Record<PresetMode, PresetConfig> = {
    light: {
        label: 'Light',
        labelVi: 'Nhẹ',
        description: 'Minimal noise, image looks almost unchanged',
        descriptionVi: 'Nhiễu nhẹ, ảnh gần như không đổi',
        intensity: 40,
        watermarkOpacity: 0.08,
    },
    standard: {
        label: 'Standard',
        labelVi: 'Tiêu chuẩn',
        description: 'Balanced protection and quality',
        descriptionVi: 'Cân bằng giữa bảo vệ và chất lượng',
        intensity: 70,
        watermarkOpacity: 0.12,
    },
    maximum: {
        label: 'Maximum',
        labelVi: 'Tối đa',
        description: 'Maximum protection, slight quality reduction',
        descriptionVi: 'Tối đa hoá bảo vệ, giảm chất lượng nhẹ',
        intensity: 100,
        watermarkOpacity: 0.20,
    },
};

export const DEFAULT_PRESET: PresetMode = 'standard';


