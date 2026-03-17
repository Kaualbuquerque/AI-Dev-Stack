"use client"

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import Skeleton from "@/app/components/ui/Skeleton";
import { Tools, toolsService } from "@/app/services/toolsService";
import { createPageUrl } from "@/app/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUp, Calendar, DollarSign, ExternalLink, Monitor, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/app/components/ui/Badge";
import { cn } from "@/app/lib/utils";
import { pricingConfig } from "@/app/types/princing";
import { useState } from "react";
import { userService } from "@/app/services/authservice";
import { typeLabels } from "@/app/types/tool";

export default function ToolDetails() {

    const queryClient = useQueryClient();
    const params = useSearchParams();
    const [isUpvoting, setIsUpvoting] = useState(false);
    const toolName = params.get('name');
    const router = useRouter();

    // Fetch tools
    const {
        data: tool,
        isLoading: isLoading,
    } = useQuery<Tools[], Error, Tools | undefined>({
        queryKey: ['tools'],
        queryFn: () => toolsService.getAll().then(res => res.content || []),
        select: (data) => data.find((tool) => tool.name === toolName),
    });

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: () => userService.getUser(),
    });

    const handleUpvote = async () => {
        if (!user) {
            router.push("/sign-in");
            return;
        }

        if (!tool) return;

        setIsUpvoting(true);
        try {
            const newVotedByMe = !tool.votedByMe;
            const newUpvotesCount = tool.votedByMe
                ? tool.upvotesCount - 1
                : tool.upvotesCount + 1;

            if (tool.votedByMe) {
                await toolsService.removeUpvote(tool.id);
            } else {
                await toolsService.upvote(tool.id);
            }

            queryClient.setQueryData<Tools[]>(['tools'], (oldTools) =>
                oldTools?.map(t =>
                    t.id === tool.id
                        ? { ...t, upvotesCount: newUpvotesCount, votedByMe: newVotedByMe }
                        : t
                )
            );

        } catch (error) {
            console.error('Failed to upvote:', error);
            toast.error('Failed to upvote. Please try again.');
        } finally {
            setIsUpvoting(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    }

    {/* Loading  */ }
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Skeleton className="h-8 w-32 mb-8 bg-slate-800" />
                <div className="flex gap-6">
                    <Skeleton className="w-24 h-24 rounded-2xl bg-slate-800" />
                    <div className="flex-1">
                        <Skeleton className="h-10 w-64 mb-3 bg-slate-800" />
                        <Skeleton className="h-5 w-full mb-2 bg-slate-800" />
                        <Skeleton className="h-5 w-3/4 bg-slate-800" />
                    </div>
                </div>
            </div>
        )
    }

    {/* Not Found */ }
    if (!tool) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Tool not found</h2>
                <Link href={createPageUrl("/")}>
                    <Button variant="outline" className="border-slate-700 text-slate-300">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to directory
                    </Button>
                </Link>
            </div>
        )
    }


    const pricing = pricingConfig[tool.pricingModel] ?? pricingConfig['Free'];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href={createPageUrl("/")}>
                        <Button variant="ghost" className="text-slate-400 hover:text-white -ml-3">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to directory
                        </Button>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Background glow */}
                    <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />

                    <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Logo */}
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-r from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center overflow-hidden shrink-0">
                                {
                                    tool.thumbnailUrl ? (
                                        <img
                                            src={tool.thumbnailUrl}
                                            alt={tool.name}
                                            className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">🤖</span>
                                    )
                                }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
                                    {tool.featured && (
                                        <Badge className="bg-linear-to-r from-cyan-500 to-purple-500 text-white border-0">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            Featured
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-lg text-slate-300 mb-4">
                                    {tool.description}
                                </p>

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        <Badge variant="outline" className={cn("text-xs", pricing.className)}>
                                            {pricing.icon} {pricing.label}
                                        </Badge>
                                    </div>
                                    {tool.toolType && (
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4" />
                                            <span>{typeLabels[tool.toolType] || tool.toolType}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Added {new Date(tool.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-700/50">
                            <Button
                                onClick={handleUpvote}
                                disabled={isUpvoting}
                                className={cn(
                                    "flex-1 sm:flex-none",
                                    tool.votedByMe
                                        ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                                        : "bg-slate-700 hover:bg-slate-600 text-white"
                                )}
                            >
                                <ArrowUp className={cn("w-4 h-4 mr-2", tool.votedByMe && "fill-current")} />
                                Upvote ({tool.upvotesCount || 0})
                            </Button>

                            {tool.url && (
                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                    <Button className="w-full bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Visit Website
                                    </Button>
                                </a>
                            )}

                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Details Grid */}
            </div>
        </div>
    )
}