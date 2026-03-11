"use client"

import { useState } from "react";
import Header from "./Header";
import SearchModal from "./SearchModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <Header onOpenSearch={() => setSearchOpen(true)} />
            <SearchModal isOpen={searchOpen} setOpen={setSearchOpen} />
            <main className="pt-16">
                {children}
            </main>
        </>
    );
}