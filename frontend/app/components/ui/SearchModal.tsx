"use client"

import { useEffect, useState } from "react";
import { createPageUrl } from "@/app/utils";
import { Search } from "lucide-react";
import { Input } from "./Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";

interface SearchModalProps {
    isOpen: boolean
    setOpen: (open: boolean) => void
}

export default function SearchModal({ isOpen, setOpen }: SearchModalProps) {

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = createPageUrl('/') + `?search=${encodeURIComponent(searchQuery)}`;
            setOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-white">Search AI Tools</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, tag, or description..."
                            className="pl-12 py-6 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-lg"
                        />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                        Press <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> to search
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}