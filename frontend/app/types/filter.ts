import { ElementType } from "react";

export type ToolType = 'cli' | 'web' | 'vscode' | 'jetbrains' | 'api' | 'desktop';

export type PricingType = 'Free' | 'Freemiun' | 'Paid'

export interface FiltersData {
    pricing: PricingType[];
    stack: string[];
    type: ToolType[];
}

export interface FilterOption {
    value: string;
    label: string;
    color?: string;
}

export interface FilterGroup {
    id: keyof FiltersData; // Garante que o ID seja uma chave válida do FiltersData
    label: string;
    icon: ElementType;
    options: FilterOption[];
}