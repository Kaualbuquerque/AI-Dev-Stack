import { PricingType } from './pricing';
import { Tag } from './tag';
import { User } from './user';

export type ToolType = 'cli' | 'web' | 'vscode' | 'jetbrains' | 'api' | 'desktop';

export const typeIcons: Record<ToolType, string> = {
    cli: '⌨️',
    web: '🌐',
    vscode: '💜',
    jetbrains: '🔶',
    api: '🔌',
    desktop: '🖥️',
};

export const typeLabels: Record<ToolType, string> = {
    cli: 'Command Line Interface',
    web: 'Web Application',
    vscode: 'VS Code Extension',
    jetbrains: 'JetBrains Plugin',
    api: 'API Service',
    desktop: 'Desktop Application',
};

export interface Tools {
    id: number;
    name: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    pricingModel: PricingType;
    toolType: ToolType;
    stacks: string[];
    tags: Tag[];
    user: User;
    isApproved: boolean;
    featured: boolean;
    upvotesCount: number;
    votedByMe: boolean;
    userEmail: string;
    createdAt: string;
}

export interface SuggestToolForm {
    name: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    pricingModel: PricingType;
    toolType: ToolType;
    tagIds: string[];
    stacks: string[];
}

export interface ToolFilters {
    search?: string;
    pricing?: string;
    type?: string;
    stack?: string[];
    sort?: string;
    tag?: string;
    votedByMe?: boolean;
    userEmail?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: {
        totalPages: number;
        totalElements: number;
        number: number;
        size: number;
    };
}