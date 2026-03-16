import { DollarSign, Layers, Monitor } from "lucide-react";
import { FilterGroup } from "../types/filter";

export const FILTER_GROUPS: FilterGroup[] = [
    {
        id: 'pricing',
        label: 'Pricing',
        icon: DollarSign,
        options: [
            { value: 'Free', label: 'Free', color: 'text-emerald-400' },
            { value: 'Freemium', label: 'Freemium', color: 'text-amber-400' },
            { value: 'Paid', label: 'Paid', color: 'text-purple-400' },
        ],
    },
    {
        id: 'stack',
        label: 'Tech Stack',
        icon: Layers,
        options: [
            { value: 'javascript', label: 'JavaScript' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' },
            { value: 'typescript', label: 'TypeScript' },
        ],
    },
    {
        id: 'type',
        label: 'Tool Type',
        icon: Monitor,
        options: [
            { value: 'cli', label: 'CLI' },
            { value: 'web', label: 'Web App' },
            { value: 'vscode', label: 'VS Code Extension' },
            { value: 'jetbrains', label: 'JetBrains Plugin' },
            { value: 'api', label: 'API' },
            { value: 'desktop', label: 'Desktop App' },
        ],
    },
];