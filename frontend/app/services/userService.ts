import { apiFetch } from "../api/client";
import { User, UserRegisterRequest } from "../types/user";

export const userService = {
    getUser: () => apiFetch<User>('/users/me'),
    register: (data: UserRegisterRequest) =>
        apiFetch<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
}