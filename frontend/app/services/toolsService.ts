import { apiFetch } from "../api/client";
import { User } from "../types/auth";
import { FiltersResponse } from "../types/filter";
import { PricingType } from "../types/princing";
import { ToolType } from "../types/tool";

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    last: boolean;
}

export interface SuggestToolForm {
    name: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    pricingModel: PricingType;
    toolType: ToolType;
}

export interface Tools {
    id: number;
    name: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    pricingModel: PricingType;
    toolType: ToolType; // Novo campo integrado
    stacks: string[];
    tags: {
        name: string;
        slug: string;
        iconKey: string;
    }[];
    user: User;
    isApproved: boolean; // Informações de status e destaque
    featured: boolean;
    upvotesCount: number;    // Contador de Upvotes (em vez de carregar a lista toda de objetos Upvote)
    votedByMe: boolean;
    userEmail: string;
    createdAt: string; // Datas no JSON costumam vir como string (ISO 8601)
}

export const toolsService = {
    getAll: (page = 0, size = 12) =>
        apiFetch<PaginatedResponse<Tools>>(`/tools?page=${page}&size=${size}`),
    getFilters: () => apiFetch<FiltersResponse>('/tools/filters'),
    upvote: (toolId: number) => apiFetch<Tools>(`/tools/${toolId}/upvote`, { method: 'POST' }),
    suggest: (formData: SuggestToolForm) => apiFetch<Tools>('/tools', {
        method: 'POST',
        body: JSON.stringify(formData)
    }),

}
