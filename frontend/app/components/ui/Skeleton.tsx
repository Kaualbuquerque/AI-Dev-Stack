import { cn } from "@/app/lib/utils";
import { HTMLAttributes } from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export default function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-primary/10', className)}
            {...props} />
    )
}