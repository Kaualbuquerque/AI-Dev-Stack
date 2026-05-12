import { apiFetch } from '../api/client';
import { Tag } from '../types/tag';

export const tagService = {
    getAll: () => apiFetch<Tag[]>('/tags'),
    getById: (id: string) => apiFetch<Tag>(`/tags/${id}`),
    create: (data: Partial<Tag>) => apiFetch<Tag>('/tags', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};