"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { createPageUrl } from "./utils";
import { Button } from "./components/ui/Button";
import { Brain, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative text-center"
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <Brain className="w-16 h-16 text-cyan-400" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                    </div>
                </div>

                {/* Error code */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-8xl font-bold mb-4"
                >
                    <span className="gradient-text">404</span>
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white mb-3"
                >
                    Page not found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 mb-10 max-w-md mx-auto"
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href={createPageUrl("/")}>
                        <Button className="bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href={createPageUrl("/community")}>
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8">
                            <Search className="w-4 h-4 mr-2" />
                            Explore Community
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}