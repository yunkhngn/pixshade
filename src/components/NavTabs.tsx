import { motion } from 'framer-motion';
import { Shield, Search } from 'lucide-react';

export type TabMode = 'protect' | 'check';

interface NavTabsProps {
    activeTab: TabMode;
    onTabChange: (tab: TabMode) => void;
}

export function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
    const tabs = [
        { id: 'protect' as TabMode, label: 'Bảo vệ', icon: Shield, description: 'Bảo vệ ảnh khỏi AI' },
        { id: 'check' as TabMode, label: 'Kiểm tra', icon: Search, description: 'Kiểm tra ảnh đã bảo vệ' },
    ];

    return (
        <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-soft border border-neutral-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl transition-all ${isActive
                                    ? 'text-white'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-xl"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
