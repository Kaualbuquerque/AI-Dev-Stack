"use client"

import { tokenStorage } from "@/app/api/client";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { useUser } from "@/app/lib/UserContext";
import { authService } from "@/app/services/authservice";
import { userService } from "@/app/services/userService";
import { createPageUrl } from "@/app/utils";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Brain, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function SingUp() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useUser();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });
            tokenStorage.set(response.token);

            const userData = await userService.getUser();
            setUser(userData);

            toast.success("Welcome back!");
            router.push(createPageUrl("/"));
        } catch (error) {
            toast.error("Invalid email or password.");
            console.error('Login error:', error);
            toast.error("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Card glow */}
                <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />

                <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <Brain className="w-12 h-12 text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome to AI-Dev <span className="gradient-text">Stack</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Sing in to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white flex items-center gap-2">
                                <Mail className="w-4 h-4 text-cyan-400" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white flex items-center gap-2">
                                <Lock className="w-4 h-4 text-cyan-400" />
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                />
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white py-6 text-base"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-5 h-5" />
                                </motion.div>
                            ) : "Sing in"}
                        </Button>
                    </form>

                    { /* Footer */}
                    <div className="flex items-center justify-between mt-6 text-sm">
                        <span className="text-slate-500">Don't have an account?</span>
                        <Link
                            href={createPageUrl("/sign-up")}
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                            Sing up
                        </Link>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}