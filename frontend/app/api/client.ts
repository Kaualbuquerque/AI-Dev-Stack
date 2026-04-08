// src/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  set: (token: string): void => {
    localStorage.setItem('token', token);
  },
  remove: (): void => {
    localStorage.removeItem('token');
  }
};

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = tokenStorage.get();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    tokenStorage.remove();
    window.location.href = '/sign-in';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null as T; // respostas vazias (204, 200 sem body)
  }

  return response.json();
}