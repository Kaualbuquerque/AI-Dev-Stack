"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { tokenStorage } from "../api/client";

export function useRequireAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = tokenStorage.get();

        if (!token) {
            router.push("/sign-in")
        }
    }, []);
}