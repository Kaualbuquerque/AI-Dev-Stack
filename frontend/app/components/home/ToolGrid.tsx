import { Tools } from "@/app/services/toolsService";
import ToolCardSkeleton from "./ToolCardSkeleton";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ToolCard from "./ToolCard";

interface ToolGrid {
    tools: Tools[],
    isLoading: boolean,
    userEmail: string,
    onUpvote: (toolName: string, newCount: number) => void
}

export default function ToolGrid({ tools, isLoading, userEmail, onUpvote }: ToolGrid) {
    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 6 }).map((_, i) => (
                    <ToolCardSkeleton key={i} index={i} />
                ))}
            </div>
        );
    }

    if (!tools || tools.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className='text-lg font-medium text-slate-300 mb-2'>No tools found</h3>
                <p className='text-slate-500 max-w-sm'>
                    Try adjusting your filters or search query to find what you're looking for.
                </p>
            </motion.div>
        );
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {tools.map((tool, index) => (
                <ToolCard
                    key={tool.name}
                    tool={tool}
                    index={index}
                    userEmail={userEmail}
                    onUpvote={onUpvote}
                />
            ))}
        </div>
    )
}