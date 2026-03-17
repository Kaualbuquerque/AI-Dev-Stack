import { apiFetch } from "../api/client";
import { PricingType } from "../types/princing";
import { ToolType } from "../types/tool";
import { User } from "./authservice";

interface PaginatedResponse<T> {
    content: T[];
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
    categories: {
        name: string;
        slug: string;
        iconKey: string;
    }[];
    user: User;
    isApproved: boolean; // Informações de status e destaque
    featured: boolean;
    upvotesCount: number;    // Contador de Upvotes (em vez de carregar a lista toda de objetos Upvote)
    votedByMe: boolean;
    createdAt: string; // Datas no JSON costumam vir como string (ISO 8601)
}

export const toolsService = {
    // 2. Informe que o retorno é o objeto que CONTÉM o array de Tools
    getAll: () => apiFetch<PaginatedResponse<Tools>>('/tools'),
    // Adicione quando souber o endpoint correto
    upvote: (toolId: number) => apiFetch<Tools>(`/tools/${toolId}/upvote`, { method: 'POST' }),
    removeUpvote: (toolId: number) => apiFetch<Tools>(`/tools/${toolId}/upvote`, { method: 'DELETE' }),
    suggest: (formData: SuggestToolForm) => apiFetch<Tools>('/tools', {
        method: 'POST',
        body: JSON.stringify(formData)
    }),
}
