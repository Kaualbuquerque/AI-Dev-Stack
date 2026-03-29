import { apiFetch } from "../api/client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    username: string;
}

export const authService = {
    login: (data: LoginRequest) =>
        apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
}