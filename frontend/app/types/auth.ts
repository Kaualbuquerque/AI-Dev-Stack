
export interface User {
    email: string,
    username: string,
    createdAt: string
    upvotedResourcesId: number[]
}

export interface UserContextType {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}
