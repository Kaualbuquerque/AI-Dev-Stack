import { apiFetch } from "../api/client";
import { LoginRequest, LoginResponse } from "../types/auth";

export const authService = {
    login: (data: LoginRequest) =>
        apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
}