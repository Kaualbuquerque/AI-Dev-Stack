"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { User, UserContextType } from "../types/auth"
import { tokenStorage } from "../api/client";
import { userService } from "../services/userService";

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = tokenStorage.get();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await userService.getUser();
                setUser(userData);
            } catch {
                tokenStorage.remove();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const clearUser = () => {
        tokenStorage.remove();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoading, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}