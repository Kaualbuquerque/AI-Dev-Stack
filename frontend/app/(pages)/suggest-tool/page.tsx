"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { cn } from "@/app/lib/utils";
import { userService } from "@/app/services/authservice";
import { SuggestToolForm, toolsService } from "@/app/services/toolsService";
import { PricingType } from "@/app/types/princing";
import { ToolType } from "@/app/types/tool";
import { createPageUrl } from "@/app/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, FileText, Globe, ImageIcon, Layers, Lightbulb, Send, Sparkles } from "lucide-react";
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
        pricingModel: '' as PricingType,
        toolType: '' as ToolType,
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

        const thumbnailUrl = formData.url
            ? `https://www.google.com/s2/favicons?domain=${formData.url}&sz=128`
            : '';

        await submitTool({ ...formData, thumbnailUrl });
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
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                {/* Thumbnail URL */}
                                {formData.url && (
                                    <div className="space-y-2">
                                        <Label className="text-white flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-cyan-400" />
                                            Thumbnail Previw
                                        </Label>
                                        <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                                            <img
                                                src={`https://www.google.com/s2/favicons?domain=${formData.url}&sz=128`}
                                                alt="Tool thumbnail"
                                                className="w-16 h-16 rounded-lg object-contain bg-slate-800 p-2"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Pricing Model */}
                                <div className="space-y-2">
                                    <Label htmlFor="pricingModel" className="text-white flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-cyan-400" />
                                        Pricing Model *
                                    </Label>
                                    <Select
                                        value={formData.pricingModel}
                                        onValueChange={(value) => setFormData({ ...formData, pricingModel: value as PricingType })}
                                    >
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                                            <SelectValue placeholder="Select pricing model" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="Free" className="text-white hover:bg-slate-700">Free</SelectItem>
                                            <SelectItem value="Freemium" className="text-white hover:bg-slate-700">Freemium</SelectItem>
                                            <SelectItem value="Paid" className="text-white hover:bg-slate-700">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tool Type*/}
                                <div className="space-y-2">
                                    <Label className="text-white flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-cyan-400" />
                                        Tool Type *
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {(["cli", "web", "vscode", "jetbrains", "api", "desktop"] as ToolType[]).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.toolType;
                                                    setFormData({ ...formData, toolType: current === type ? '' as ToolType : type });
                                                }}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                                                    formData.toolType === type
                                                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                                                        : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-white flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-cyan-400" />
                                        Why should we add this tool?
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Tell us what makes this tool special..."
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-30"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white py-6 text-lg"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Sparkles className="w-5 h-5 mr-2" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr2" />
                                            Submit Suggestion
                                        </>
                                    )}
                                </Button>

                                {!user && (
                                    <p className="text-center text-sm text-slate-500">
                                        You'll need to sign in to submit a suggestion.
                                    </p>
                                )}

                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}