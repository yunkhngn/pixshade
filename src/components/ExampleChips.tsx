import { motion } from 'framer-motion';
import { User, Mountain, Building } from 'lucide-react';

interface ExampleChipsProps {
    onSelectExample: (example: string) => void;
}

const examples = [
    { id: 'portrait', label: 'Bocchi', icon: User, color: 'accent-lavender' },
    { id: 'landscape', label: 'Frieren', icon: Mountain, color: 'accent-mint' },
    { id: 'street', label: 'Thắng Ngọt', icon: Building, color: 'primary' },
];

export function ExampleChips({ onSelectExample }: ExampleChipsProps) {
    return (
        <motion.div
            className="flex flex-wrap justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <span className="text-sm text-neutral-400 mr-2 self-center">
                Try an example:
            </span>
            {examples.map((example, index) => {
                const Icon = example.icon;
                const bgColor =
                    example.color === 'accent-lavender'
                        ? 'bg-accent-lavender'
                        : example.color === 'accent-mint'
                            ? 'bg-accent-mint'
                            : 'bg-primary/20';

                return (
                    <motion.button
                        key={example.id}
                        onClick={() => onSelectExample(example.id)}
                        className={`px-4 py-2 rounded-full ${bgColor} text-neutral-600 text-sm font-medium flex items-center gap-2 hover:shadow-soft transition-all`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon className="w-4 h-4" />
                        {example.label}
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
