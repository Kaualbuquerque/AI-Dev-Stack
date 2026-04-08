import { cn } from "@/app/lib/utils";
import { Tools, toolsService } from "@/app/services/toolsService";
import { createPageUrl } from "@/app/utils";
import { motion } from "framer-motion";
import { ArrowUp, ExternalLink, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useState } from "react";
import { PricingType, pricingConfig } from "@/app/types/princing";
import { typeIcons } from "@/app/types/tool";


interface ToolCardProps {
    tool: Tools;
    onUpvote: (toolId: number, newUpvotesCount: number, newVotedByMe: boolean) => void;
    userEmail: string | null;
    index: number;
}

export default function ToolCard({ tool, onUpvote, userEmail, index = 0 }: ToolCardProps) {

    const [isUpvoting, setIsUpvoting] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState(tool.upvotesCount || 0);
    const [hasUpvoted, setHasUpvoted] = useState(tool.votedByMe);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userEmail) return;

        setIsUpvoting(true);
        try {
            const newVotedByMe = !hasUpvoted;
            const newUpvotesCount = hasUpvoted ? localUpvotes - 1 : localUpvotes + 1;

            await toolsService.upvote(tool.id);

            setLocalUpvotes(newUpvotesCount);
            setHasUpvoted(newVotedByMe);

            if (onUpvote) onUpvote(tool.id, newUpvotesCount, newVotedByMe);

        } catch (error) {
            console.error('Failed to upvote:', error);
        } finally {
            setIsUpvoting(false);
        }
    };

    const normalizedPricing = tool.pricingModel
        ? (tool.pricingModel.charAt(0).toUpperCase() + tool.pricingModel.slice(1).toLowerCase()) as PricingType
        : 'Free';
    const pricing = pricingConfig[normalizedPricing] || pricingConfig['Free'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group">

            <div className={cn(
                'relative h-full p-5 rounded-2xl',
                'bg-slate-800/40 border border-slate-700/50',
                'hover:border-cyan-500/50 hover:bg-slate-800/60',
                'transition-all duration-300',
                'hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'
            )}>
                <Link href={createPageUrl('Tool-details') + `?name=${tool.name}`}>

                    {/* Featured Badge */}
                    {tool.featured && (
                        <div className='absolute -top-2 -right-2 z-10'>
                            <div className='flex items-center gap-1 px-2 py-1 rounded-full bg-linear-to-r from-cyan-500 to-purple-500 text-xs font-medium text-white shadow-lg'>
                                <Sparkles className='w-3 h-3' />
                                Featured
                            </div>
                        </div>
                    )}

                    {/* Pricing Badge */}
                    <div className='absolute top-4 right-4'>
                        <Badge variant='outline' className={cn('text-xs', pricing.className)}>
                            {pricing.label}
                        </Badge>
                    </div>

                    {/* Header */}
                    <div className='flex items-start gap-3 mb-4 pr-16'>
                        <div className='w-12 h-12 rounded-xl bg-linear-to-r from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center overflow-hidden shrink-0'>
                            {tool.thumbnailUrl ? (
                                <img
                                    src={tool.thumbnailUrl}
                                    alt={tool.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl">{typeIcons[tool.toolType] || '🤖'}</span>
                            )}
                        </div>
                        <div className='min-w-0'>
                            <h3 className='font-semibold text-white truncate group-hover:text-cyan-400 transition-colors'>
                                {tool.name}
                            </h3>
                            {tool.toolType && (
                                <span className='text-xs text-slate-500 capitalize'>
                                    {tool.toolType.replace('_', ' ')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-sm text-slate-400 line-clamp-2 mb-4 min-h-10'>
                        {tool.description}
                    </p>

                    {/* Tags */}
                    <div className='flex flex-wrap gap-1.5 mb-4 min-h-7'>
                        {(tool.tags || []).slice(0, 3).map((tag) => (
                            <span key={tag.slug} className='inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-400 bg-slate-700/50 rounded-md'>
                                <Tag className='w-2.5 h-2.5' />
                                {tag.name}
                            </span>
                        ))}
                        {(tool.tags || []).length > 3 && (
                            <span className='text-xs text-slate-500'>
                                +{tool.tags.length - 3}
                            </span>
                        )}
                    </div>

                </Link>
                {/* Footer */}
                <div className='flex items-center justify-between pt-3 border-t border-slate-700/50'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleUpvote}
                        disabled={isUpvoting}
                        className={cn('h-8 px-3 rounded-full transition-all',
                            hasUpvoted
                                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-700'
                        )}
                    >
                        <motion.div
                            animate={isUpvoting ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowUp className={cn("w-4 h-4 mr-1", hasUpvoted && "fill-current")} />
                        </motion.div>
                        <motion.span
                            key={localUpvotes}
                            initial={{ scale: 1.3, color: '#06B6D4' }}
                            animate={{ scale: 1, color: hasUpvoted ? '#06B6D4' : '#94A3B8' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {localUpvotes}
                        </motion.span>
                    </Button>

                    {tool.url && (
                        <a href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className='p-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors'>
                            <ExternalLink className='w-4 h-4' />
                        </a>
                    )}
                </div>
            </div>
        </motion.div >
    )
}