import { motion } from "framer-motion";
import Skeleton from "../ui/Skeleton";

export default function ToolCardSkeleton({ index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">

            {/* Header */}
            <div className='flex items-start gap-3 mb-4'>
                <Skeleton className='w-12 h-12 rounded-xl bg-slate-700/50' />
                <div className='flex-1'>
                    <Skeleton className='w-32 h-5 mb-2 bg-slate-700/50' />
                    <Skeleton className='w-16 h-3 bg-slate-700/50' />
                </div>
                <Skeleton className='w-16 h-5 rounded-full bg-slate-700/50' />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full bg-slate-700/50" />
                <Skeleton className="h-4 w-3/4 bg-slate-700/50" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16 rounded-md bg-slate-700/50" />
                <Skeleton className="h-6 w-20 rounded-md bg-slate-700/50" />
                <Skeleton className="h-6 w-14 rounded-md bg-slate-700/50" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <Skeleton className="h-8 w-16 rounded-full bg-slate-700/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-700/50" />
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-slate-700/10 to-transparent" />
            </div>
        </motion.div>
    )
}