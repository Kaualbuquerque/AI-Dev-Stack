"use client"

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUp, Award, Crown, Medal, Sparkle, TrendingUp, Trophy, Users } from "lucide-react";
import { Tools, toolsService } from "../services/toolsService";
import { cn } from "../lib/utils";
import Link from "next/link";
import { createPageUrl } from "../utils";
import { Badge } from "../components/ui/Badge";

export default function Community() {

    // Fetch tools
    const {
        data: tools = [],
        isLoading: isLoadingTools,
    } = useQuery<Tools[]>({
        queryKey: ['tools'],
        queryFn: () => toolsService.getAll().then(res => res.content || []),
        // O 'select' intercepta o dado e o entrega ordenado para a variável 'tools'
        select: (data) => [...data].sort((a, b) => b.upvotesCount - a.upvotesCount),
    });

    // Get top tools
    const topTools = tools.slice(0, 10);

    // Get trending (most recently added with good upvotes)
    const trendingTools = [...tools]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .filter(tool => (tool.upvotesCount || 0) >= 5)
        .slice(0, 5)

    // Stats
    const totalUpvotes = tools.reduce((sum, tool) => sum + (tool.upvotesCount || 0), 0);

    const rankIcons = [
        <Crown key='crown' className='w-5 h-5 text-yellow-400' />,
        <Medal key='medal' className='w-5 h-5 text-slate-400' />,
        <Award key='award' className='w-5 h-5 text-amber-600' />,
    ];

    return (
        <div className='min-h-screen py-12'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6'>
                        <Users className='w-4 h-4 text-cyan-400' />
                        <span className='text-sm text-cyan-300'>Community Hub</span>
                    </div>
                    <h1 className='text-4xl font-bold text-white mb-4'>
                        Community Leaderboard
                    </h1>
                    <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
                        Discover the most loved AI tools, voted by our community of developers;
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'
                >
                    {[
                        { label: 'Total Tools', value: tools.length, icon: Sparkle, color: 'cyan' },
                        { label: 'Total Upvotes', value: totalUpvotes, icon: ArrowUp, color: 'purple' },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className={cn(
                                'p-6 rounded-2xl border',
                                'bg-slate-800/30 border-slate-700/50'
                            )}
                        >
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                                stat.color === 'cyan' && 'text-cyan-400',
                                stat.color === 'purple' && 'text-purple-400',
                            )}>
                                <stat.icon className={cn(
                                    'w-6 h-6',
                                    stat.color === 'cyan' && 'text-cyan-400',
                                    stat.color === 'purple' && 'text-purple-400',
                                )} />
                            </div>
                            <p className='text-3xl font-bold text-white mb-1'>{stat.value}</p>
                            <p className='text-slate-400'>{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Top 10 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='lg:col-span-2'
                    >
                        <div className='bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6'>
                            <div className='flex items-center gap-3 mb-6'>
                                <Trophy className='w-6 h-6 text-yellow-400' />
                                <h2 className='text-xl font-bold text-white'>Top 10 Tools</h2>
                            </div>

                            <div className='space-y-3'>
                                {topTools.map((tool, index) => (
                                    <Link key={tool.name} href={createPageUrl('ToolDetails') + `?name=${tool.name}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            whileHover={{ x: 4 }}
                                            className={cn(
                                                'flex items-center gap-4 p-4 rounded-xl',
                                                'bg-slate-800/50 border border-slate-700/50',
                                                'hover:border-cyan-500/50 hover:bg-slate-800',
                                                'transition-all cursor-pointer'
                                            )}
                                        >
                                            {/* Rank */}
                                            <div className='w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0'>
                                                {index < 3 ? rankIcons[index] : (
                                                    <span className='text-lg font-bold text-slate-400'>
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Logo */}
                                            <div className='w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center overflow-hidden shrink-0'>
                                                {tool.thumbnailUrl ? (
                                                    <img src={tool.thumbnailUrl} alt={tool.name} className='w-full h-full object-cover' />
                                                ) : (
                                                    <span className='text-xl'>🤖</span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-semibold text-white truncate'>{tool.name}</h3>
                                                <p className='text-sm text-slate-400 truncate'>{tool.description}</p>
                                            </div>

                                            {/* Upvotes */}
                                            <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 shrink-0'>
                                                <ArrowUp className='w-4 h-4' />
                                                <span className='font-semibold'>{tool.upvotesCount || 0}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Trending */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className='bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6'>
                            <div className='flex items-center gap-3 mb-6'>
                                <TrendingUp className='w-6 h-6 text-purple-400' />
                                <h2 className='text-xl font-bold text-white'>Trending</h2>
                            </div>

                            {trendingTools.length > 0 ? (
                                <div className='space-y-4'>
                                    {trendingTools.map((tool, index) => (
                                        <Link key={tool.name} href={createPageUrl('ToolDetails' + `?name=${tool.name}`)}>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                whileHover={{ scale: 1.02 }}
                                                className={cn(
                                                    'p-4 rounded-xl',
                                                    'bg-slate-800/50 border border-slate-700/50',
                                                    'hover:border-purple-500/50',
                                                    'transition-all cursor-pointer'
                                                )}
                                            >
                                                <div className='flex items-center gap-3 mb-2'>
                                                    <div className='w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden'>
                                                        {tool.thumbnailUrl ? (
                                                            <img src={tool.thumbnailUrl} alt={tool.name} className='w-full h-full object-cover' />
                                                        ) : (
                                                            <span className='text-lg'>🔥</span>
                                                        )}
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <h3 className='font-medium text-white truncate text-sm'>{tool.name}</h3>
                                                    </div>
                                                    <div className='flex items-center justify-between'>
                                                        <Badge variant='outline' className='bg-purple-500/10 border-purple-500/30 text-purple-300 text-xs'>
                                                            New
                                                        </Badge>
                                                        <span className='text-xs text-slate-400'>
                                                            {tool.upvotesCount || 0} upvotes
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-slate-500 text-center py-8'>
                                    No trending tools yet
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div >
        </div >
    )

}