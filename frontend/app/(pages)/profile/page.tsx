"use client"

import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Calendar, LogOut, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/app/components/ui/Badge";
import { Tools, toolsService } from "@/app/services/toolsService";
import { Button } from "@/app/components/ui/Button";
import { createPageUrl } from "@/app/utils";
import { cn } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";

export default function Profile() {

    useRequireAuth()
    const router = useRouter();
    const quaryClient = useQueryClient();
    const { user, isLoading, clearUser } = useUser();

    // Fetch tools
    const {
        data: tools = [],
    } = useQuery<Tools[]>({
        queryKey: ["tools"],
        queryFn: () => toolsService.getAll().then(res => res.content || []),
        // O "select" intercepta o dado e o entrega ordenado para a variável "tools"
        select: (data) => [...data].sort((a, b) => b.upvotesCount - a.upvotesCount),
    });

    // Get tools user upvoted
    const upvotedTools = useMemo(() =>
        tools.filter(tool => tool.votedByMe)
        , [tools]);

    const suggestions = useMemo(() => {
        if (!user?.email) return [];
        return tools.filter(tool => tool.user.email === user.email);
    }, [tools, user]);

    const handleLogout = () => {
        clearUser();
        quaryClient.clear();
        router.push("/sign-in");
    };

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
                                {user?.email[0] || 'U'}
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
                                        Joined {isLoading ? "..." : new Date(user!.createdAt).toLocaleDateString()}
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
                                Sing Out
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                            <div className="text-center p-4 rounded-xl bg-slate-800/50">
                                <p className="text-2xl font-bold text-cyan-400">{upvotedTools.length}</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {upvotedTools.map((tool) => (
                                <Link key={tool.name} href={createPageUrl("Tool-details") + `?name=${tool.name}`}>
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
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb6">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-bold text-white">Your Suggestions</h2>
                        </div>

                        <div className="space-y-3">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.name}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <div>
                                        <h3 className="font-medium text-white">{suggestion.name}</h3>
                                        <p className="text-sm text-slate-400 truncate max-w-md">
                                            {suggestion.url}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            suggestion.isApproved === true && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                            suggestion.isApproved === false && "bg-red-500/20 text-red-400 border-red-500/30"
                                        )}
                                    >
                                        {suggestion.isApproved}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div >
    )
}