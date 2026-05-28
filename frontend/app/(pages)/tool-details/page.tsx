import { Suspense } from "react";
import ToolDetailsContent from "./ToolDetailsContent";

export default function ToolDetailsPage() {
    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="h-8 w-32 mb-8 bg-slate-800 rounded animate-pulse" />
                <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 animate-pulse" />
                    <div className="flex-1 space-y-3">
                        <div className="h-10 w-64 bg-slate-800 rounded animate-pulse" />
                        <div className="h-5 w-full bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        }>
            <ToolDetailsContent />
        </Suspense>
    );
}