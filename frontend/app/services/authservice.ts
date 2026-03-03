import { apiFetch } from "../api/client"

export interface User {
    email: string,
    username: string,
    createdAt: string
    upvotedResourcesId: number[]
}

const email = "exemple@gmail.com"
export const userService = {
    getUser: () => apiFetch<User>(`/users/search?email=${email}`) 
}