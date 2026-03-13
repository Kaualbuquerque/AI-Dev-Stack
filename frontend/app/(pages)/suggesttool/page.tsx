"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { userService } from "@/app/services/authservice";
import { SuggestToolForm, toolsService } from "@/app/services/toolsService";
import { createPageUrl } from "@/app/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Globe, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function SuggestTool() {

    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<SuggestToolForm>({
        name: '',
        description: '',
        url: '',
        thumbnailUrl: '',
        pricingModel: 'Free',
        toolType: 'web',
    });
    const router = useRouter();

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: () => userService.getUser(),
    });

    const { mutateAsync: submitTool, isPending: isSubmitting } = useMutation({
        mutationFn: (formData: SuggestToolForm) => {
            console.log('Enviando ferramenta:', formData); // ✅ mostra o que está sendo enviado
            return toolsService.suggest(formData);
        },
        onSuccess: (response) => {
            console.log('Resposta do backend:', response); // ✅ mostra a resposta
            setSubmitted(true);
            toast.success("Tool submitted successfully!");
        },
        onError: (error) => {
            console.error('Erro ao enviar:', error); // ✅ mostra o erro completo
            toast.error("Failed to submit. Please try again later.");
        }
    });

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            router.push("/sign-in");
            return;
        }

        if (!formData.name || !formData.url) {
            toast.error("Fill in the name and URL of the tool.");
            return;
        }

        await submitTool(formData);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href={createPageUrl("/")}>
                        <Button variant="ghost" className="text-slate-400 hover:text-white -ml-3">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to directory
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">Community Powered</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Suggest an AI Tool
                        </h1>
                        <p className="text-lg text-slate-400 max-w-lg mx-auto">
                            Know an amazing AI tool that should be in our directory?
                            Share it with the community!
                        </p>
                    </div>

                    {/* Form */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />

                        <form
                            onSubmit={handleSubmit}
                            className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8"
                        >
                            <div className="space-y-6">
                                {/* Tool name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-cyan-400" />
                                        Tool Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Github Copilot"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                {/* Website URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-white flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-cyan-400" />
                                        Website URL *
                                    </Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-white flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-cyan-400" />
                                        Why should we add this tool?
                                    </Label>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}