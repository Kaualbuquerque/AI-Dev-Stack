import React from 'react';

import { motion } from "framer-motion"
import { Bot, Brain, Code2, Database, Sparkles, Zap } from 'lucide-react';

const trendingTags = [
    { label: 'Copilots', icon: Zap },
    { label: 'Chatbots', icon: Bot },
    { label: 'Code Gen', icon: Code2 },
    { label: 'Data Science', icon: Database },
    { label: 'LLMs', icon: Brain },
];

interface HeroSectionProps {
    onTagClick: (tagName: string) => void;
    activeTag: string | null;
}

export default function HeroSection({ onTagClick, activeTag }: HeroSectionProps) {
    return (
        <section className='relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16'>
            {/* Background Effects */}
            <div className='absolut inset-0 pointer-events-none'>
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl'></div>
                <div className='absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'></div>
            </div>

            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6'>
                        <Sparkles className='w-4 h-4 text-cyan-400' />
                        <span className='text-sm text-slate-300'>Curated collection of 100+ AI tools</span>
                    </div>

                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
                        <span className='text-white'>Optimaze your workflow</span>
                        <br />
                        <span className='gradient-text'>with the best AIs</span>
                    </h1>

                    <p className='max-w-2x1 mx-auto text-lg sm:text-xl text-slate-400 mb-10'>
                        Discover, compare and integate the most powerful AI tools for developers.
                        Hand-picked and comunity-rated.
                    </p>
                </motion.div>

                {/* Trending Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='flex flex-wrap justify-center gap-3'
                >
                    {trendingTags.map((tag, index) => {
                        const Icon = tag.icon;
                        const isActive = activeTag === tag.label;
                        return (
                            <motion.button
                                key={tag.label}
                                onClick={() => onTagClick(tag.label)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                ${isActive
                                        ? 'bg-linear-to-r from-cyan-500 to-purple-500 text-white glow-cyan'
                                        : 'bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800'
                                    }`}
                            >
                                <Icon className='w-4 h-4' />
                                #{tag.label}
                            </motion.button>
                        )
                    })}

                </motion.div>
            </div>
        </section>
    )
}