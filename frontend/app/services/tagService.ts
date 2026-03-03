import { apiFetch } from '../api/client';

export interface Tag {
    id: string;
    name: string;
    usageCount: number;
}

export const tagService = {
    getAll: () => apiFetch<Tag[]>('/tags'),
    getById: (id: string) => apiFetch<Tag>(`/tags/${id}`),
    create: (data: Partial<Tag>) => apiFetch<Tag>('/tags', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};