"use client"

import { motion } from "framer-motion";
import { ArrowLeft, Brain, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { toast } from "sonner";
import { createPageUrl } from "@/app/utils";
import { userService } from "@/app/services/userService";

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.username || !formData.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            await userService.register({
                email: formData.email,
                username: formData.username,
                password: formData.password
            });

            toast.success("Account created! Please sign in.");
            router.push(createPageUrl("/sign-in"));
        } catch (error) {
            toast.error("Failed to create account. Email may already be in use.");
        } finally {
            setIsLoading(false);
        }
    };

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

                    {/* Back button */}
                    <Link
                        href={createPageUrl("/sign-in")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <Brain className="w-12 h-12 text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create your account</h1>
                        <p className="text-slate-400 text-sm mt-1">Join the AI-Dev Stack community</p>
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
                            <Label htmlFor="username" className="text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-cyan-400" />
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="ai_explorer"
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
                                    placeholder="Min. 6 characters"
                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
                                <Lock className="w-4 h-4 text-cyan-400" />
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Re-enter password"
                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
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
                            ) : "Create account"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-center mt-6 text-sm gap-1">
                        <span className="text-slate-500">Already have an account?</span>
                        <Link
                            href={createPageUrl("/sign-in")}
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}