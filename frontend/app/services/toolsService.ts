import { apiFetch } from "../api/client";
import { FiltersResponse } from "../types/filter";
import { Tag } from "../types/tag";
import { PaginatedResponse, SuggestToolForm, ToolFilters, Tools } from "../types/tool";

export const toolsService = {
    getAll: (page = 0, size = 12, filters?: ToolFilters) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));

        if (filters?.search) params.set('search', filters.search);
        if (filters?.pricing) params.set('pricing', filters.pricing);
        if (filters?.type) params.set('type', filters.type);
        if (filters?.stack?.length) {
            filters.stack.forEach(s => params.append('stack', s));
        };
        if (filters?.tag) params.set('tag', filters.tag);
        if (filters?.sort) {
            switch (filters.sort) {
                case 'upvotes':
                    params.set('sort', 'upvotesCount,desc');
                    break;
                case 'newest':
                    params.set('sort', 'createdAt,desc');
                    break;
                case 'name':
                    params.set('sort', 'name,asc');
                    break;
            }
        };
        if (filters?.votedByMe) params.set('votedByMe', 'true');
        if (filters?.userEmail) params.set('userEmail', filters.userEmail);
        return apiFetch<PaginatedResponse<Tools>>(`/tools?${params.toString()}`);
    },

    suggest: (formData: SuggestToolForm) =>
        apiFetch<Tools>('/tools', {
            method: 'POST',
            body: JSON.stringify(formData)
        }),

    getFilters: () =>
        apiFetch<FiltersResponse>('/tools/filters'),

    upvote: (toolId: number) =>
        apiFetch<Tools>(`/tools/${toolId}/upvote`, { method: 'POST' }),

    getVotedByMe: () =>
        apiFetch<PaginatedResponse<Tools>>(`/tools?votedByMe=true&size=100`),

    getByName: (name: string) =>
        apiFetch<Tools>(`/tools/search?name=${encodeURIComponent(name)}`),

    getTags: () =>
        apiFetch<Tag[]>('/tags'),

    getPending: (page = 0, size = 12) =>
        apiFetch<PaginatedResponse<Tools>>(`/tools/pending?page=${page}&size=${size}`),

    approve: (toolId: number) =>
        apiFetch<Tools>(`/tools/${toolId}/approve`, { method: 'PATCH' }),

    feature: (toolId: number) =>
        apiFetch<Tools>(`/tools/${toolId}/feature`, { method: 'PATCH' }),

    update: (toolId: number, data: any) =>
        apiFetch<Tools>(`/tools/${toolId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    deleteTool: (toolId: number) =>
        apiFetch<void>(`/tools/${toolId}`, { method: 'DELETE' }),

}
