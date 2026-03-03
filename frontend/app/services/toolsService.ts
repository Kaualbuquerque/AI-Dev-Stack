import { apiFetch } from "../api/client";
import { PricingType, ToolType } from "../types/filter";

interface PaginatedResponse<T> {
    content: T[];
  }

export interface Tools {
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
    isApproved: boolean; // Informações de status e destaque
    featured: boolean;
    upvotesCount: number;    // Contador de Upvotes (em vez de carregar a lista toda de objetos Upvote)
    votedByMe: boolean;
    createdAt: string; // Datas no JSON costumam vir como string (ISO 8601)
}

export const toolsService = {
    // 2. Informe que o retorno é o objeto que CONTÉM o array de Tools
    getAll: () => apiFetch<PaginatedResponse<Tools>>('/tools')
}