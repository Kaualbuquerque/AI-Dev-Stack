"use client"

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Calendar, LogOut, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { createPageUrl } from "@/app/utils";
import { cn } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { toolsService } from "@/app/services/toolsService";

export default function Profile() {

    useRequireAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading, clearUser } = useUser();
    const [upvotedPage, setUpvotedPage] = useState(0);
    const [suggestionsPage, setSuggestionsPage] = useState(0);
    const PAGE_SIZE = 6;

    // Fetch ferramentas votadas
    const { data: upvotedToolsPage } = useQuery({
        queryKey: ["tools", "votedByMe", upvotedPage],
        queryFn: () => {
            console.log('Fetching voted tools for:', user?.email);
            return toolsService.getAll(upvotedPage, PAGE_SIZE, { votedByMe: true });
        },
        enabled: !!user,
    });

    // Fetch sugestões do usuário
    const { data: suggestionsToolsPage } = useQuery({
        queryKey: ["tools", "suggestions", suggestionsPage],
        queryFn: () => {
            console.log('Fetching suggestions for:', user?.email);
            return toolsService.getAll(suggestionsPage, PAGE_SIZE, {
                userEmail: user?.email
            });
        },
        enabled: !!user,
    });

    const upvotedTools = upvotedToolsPage?.content || [];
    const upvotedTotalPages = upvotedToolsPage?.page?.totalPages || 0;
    const upvotedTotalElements = upvotedToolsPage?.page?.totalElements || 0;

    const suggestions = suggestionsToolsPage?.content || [];
    const suggestionsTotalPages = suggestionsToolsPage?.page?.totalPages || 0;

    const handleLogout = () => {
        clearUser();
        queryClient.clear();
        router.push("/sign-in");
    };

    if (!user && !isLoading) return null;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8"
                >
                    <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />

                    <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                                {user?.email[0].toUpperCase() || 'U'}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    {user?.username || 'Anonymous User'}
                                </h1>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {user?.email}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "..."}
                                    </span>
                                </div>
                            </div>

                            {/* Logout */}
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                            <div className="text-center p-4 rounded-xl bg-slate-800/50">
                                <p className="text-2xl font-bold text-cyan-400">{upvotedTotalElements}</p>
                                <p className="text-sm text-slate-400">Tools Upvoted</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Upvoted Tools */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowUp className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-bold text-white">Your Upvoted Tools</h2>
                    </div>

                    {upvotedTools.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {upvotedTools.map((tool) => (
                                    <Link key={tool.id} href={createPageUrl("/tool-details") + `?name=${tool.name}`}>
                                        <div className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl",
                                            "bg-slate-800/50 border border-slate-700/50",
                                            "hover:border-cyan-500/50 transition-all cursor-pointer"
                                        )}>
                                            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden">
                                                {tool.thumbnailUrl ? (
                                                    <img src={tool.thumbnailUrl} alt={tool.name} />
                                                ) : (
                                                    <span>🤖</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">{tool.name}</h3>
                                                <p className="text-xs text-slate-400">{tool.upvotesCount || 0} upvotes</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Paginação upvoted */}
                            {upvotedTotalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setUpvotedPage(p => Math.max(0, p - 1))}
                                        disabled={upvotedPage === 0}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-slate-400 text-sm">
                                        {upvotedPage + 1} / {upvotedTotalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setUpvotedPage(p => Math.min(upvotedTotalPages - 1, p + 1))}
                                        disabled={upvotedPage === upvotedTotalPages - 1}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 mb-4">You haven't upvoted any tools yet</p>
                            <Link href={createPageUrl("/")}>
                                <Button className="bg-linear-to-r from-cyan-500 to-purple-500 text-white">
                                    Explore Tools
                                </Button>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-bold text-white">Your Suggestions</h2>
                    </div>

                    {suggestions.length > 0 ? (
                        <>
                            <div className="space-y-3">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                                    >
                                        <div>
                                            <h3 className="font-medium text-white">{suggestion.name}</h3>
                                            <p className="text-sm text-slate-400 truncate max-w-md">
                                                {suggestion.url}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                suggestion.isApproved
                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                            )}
                                        >
                                            {suggestion.isApproved ? "Approved" : "Pending"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>

                            {/* Paginação suggestions */}
                            {suggestionsTotalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSuggestionsPage(p => Math.max(0, p - 1))}
                                        disabled={suggestionsPage === 0}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-slate-400 text-sm">
                                        {suggestionsPage + 1} / {suggestionsTotalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSuggestionsPage(p => Math.min(suggestionsTotalPages - 1, p + 1))}
                                        disabled={suggestionsPage === suggestionsTotalPages - 1}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">You haven't suggested any tools yet</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}