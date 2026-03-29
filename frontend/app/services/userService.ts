import { apiFetch } from "../api/client";
import { User } from "../types/auth";

export interface UserRegisterRequest {
    email: string;
    username: string;
    password: string;
}

export const userService = {
    getUser: () => apiFetch<User>('/users/me'),
    register: (data: UserRegisterRequest) =>
        apiFetch<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
}