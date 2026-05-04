"use client"

import { motion } from "framer-motion";
import { useRequireAuth } from "@/app/hooks/useRequireAuth"
import { useUser } from "@/app/lib/UserContext";
import { Tools, toolsService } from "@/app/services/toolsService";
import { PricingType, pricingConfig } from "@/app/types/princing";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, Pencil, Shield, Star, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/app/components/ui/Badge";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { ToolType } from "@/app/types/tool";

type Tab = 'pending' | 'approved';

export default function Admin() {

    useRequireAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading } = useUser();
    const [activeTab, setActiveTab] = useState<Tab>('pending');
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [editingTool, setEditingTool] = useState<Tools | null>(null);

    useEffect(() => {
        if (!isLoading && user && user.role !== 'ADMIN') {
            router.push('/');
        }
    }, [user, isLoading]);

    if (!user && !isLoading) return null;
    if (!isLoading && user?.role !== 'ADMIN') return null;

    // Fetch pendentes
    const { data: pendingPage, isLoading: isLoadingPending } = useQuery({
        queryKey: ['tools', 'pending', currentPage],
        queryFn: () => toolsService.getPending(currentPage, 12),
        enabled: activeTab === 'pending',
    });

    // Fetch aprovadas
    const { data: approvedPage, isLoading: isLoadingApproved } = useQuery({
        queryKey: ['tools', 'approved', currentPage],
        queryFn: () => toolsService.getAll(currentPage, 12),
        enabled: activeTab === 'approved',
    });

    const toolsPage = activeTab === 'pending' ? pendingPage : approvedPage;
    const isLoadingTools = activeTab === 'pending' ? isLoadingPending : isLoadingApproved;
    const tools = toolsPage?.content || [];
    const totalPages = toolsPage?.totalPages || 0;
    const totalElements = toolsPage?.totalElements || 0;

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setCurrentPage(0);
    };

    const handleAction = async (toolId: number, action: 'approve' | 'feature' | 'delete') => {
        setLoadingAction(`${action}-${toolId}`);
        try {
            switch (action) {
                case 'approve':
                    await toolsService.approve(toolId);
                    toast.success('Tool approved successfully!');
                    queryClient.invalidateQueries({ queryKey: ['tools', 'pending'] });
                    break;
                case 'feature':
                    await toolsService.feature(toolId);
                    toast.success('Tool featured status updated!');
                    queryClient.invalidateQueries({ queryKey: ['tools'] });
                    break;
                case 'delete':
                    await toolsService.deleteTool(toolId);
                    toast.success('Tool deleted successfully!');
                    queryClient.invalidateQueries({ queryKey: ['tools'] });
                    break;
            }
        } catch (error) {
            toast.error('Action failed. Please try again.');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleEdit = async () => {
        if (!editingTool) return;
        setLoadingAction('edit');
        try {
            await toolsService.update(editingTool.id, {
                name: editingTool.name,
                description: editingTool.description,
                url: editingTool.url,
                thumbnailUrl: editingTool.thumbnailUrl,
                pricingModel: editingTool.pricingModel,
                toolType: editingTool.toolType,
                stacks: editingTool.stacks,
                tagIds: editingTool.tags.map(t => t.id),
            });
            toast.success('Tool updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['tools'] });
            setEditingTool(null);
        } catch (error) {
            toast.error('Failed to update tool.');
        } finally {
            setLoadingAction(null);
        }
    };

    const normalizedPricing = (pricingModel: string) =>
        (pricingModel.charAt(0).toUpperCase() + pricingModel.slice(1).toLowerCase()) as PricingType;

    const ToolCard = ({ tool, index }: { tool: Tools; index: number }) => {
        const pricing = pricingConfig[normalizedPricing(tool.pricingModel)] || pricingConfig['Free'];
        return (
            <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
            >
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center overflow-hidden shrink-0">
                        {tool.thumbnailUrl ? (
                            <img src={tool.thumbnailUrl} alt={tool.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">🤖</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                            <Badge variant="outline" className={cn("text-xs", pricing.className)}>
                                {pricing.icon} {pricing.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 capitalize">
                                {tool.toolType}
                            </Badge>
                            {tool.featured && (
                                <Badge variant="outline" className="text-xs bg-amber-500/20 border-amber-500/30 text-amber-400">
                                    ⭐ Featured
                                </Badge>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2 line-clamp-2">{tool.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>By <span className="text-slate-300">{tool.userEmail}</span></span>
                            <span>Added {new Date(tool.createdAt).toLocaleDateString()}</span>
                            {tool.tags?.map(tag => (
                                <span key={tag.slug} className="px-2 py-0.5 bg-slate-700/50 rounded-md text-slate-400">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {activeTab === 'pending' && (
                            <Button
                                size="sm"
                                onClick={() => handleAction(tool.id, 'approve')}
                                disabled={loadingAction === `approve-${tool.id}`}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                        )}

                        {activeTab === 'approved' && (
                            <Button
                                size="sm"
                                onClick={() => setEditingTool(tool)}
                                className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                            >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                        )}

                        <Button
                            size="sm"
                            onClick={() => handleAction(tool.id, 'feature')}
                            disabled={loadingAction === `feature-${tool.id}`}
                            className={cn(
                                "border",
                                tool.featured
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-slate-700/50 text-slate-400 border-slate-600 hover:bg-slate-700"
                            )}
                        >
                            <Star className="w-4 h-4 mr-1" />
                            {tool.featured ? 'Unfeature' : 'Feature'}
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => handleAction(tool.id, 'delete')}
                            disabled={loadingAction === `delete-${tool.id}`}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {activeTab === 'pending' ? 'Reject' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Admin Panel</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tool Management</h1>
                    <p className="text-slate-400">
                        {totalElements} tool{totalElements !== 1 ? 's' : ''} {activeTab === 'pending' ? 'awaiting approval' : 'approved'}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-slate-800/50 rounded-xl w-fit">
                    <button
                        onClick={() => handleTabChange('pending')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'pending'
                                ? "bg-slate-700 text-white"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        Pending
                        {pendingPage?.totalElements ? (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                                {pendingPage.totalElements}
                            </span>
                        ) : null}
                    </button>
                    <button
                        onClick={() => handleTabChange('approved')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'approved'
                                ? "bg-slate-700 text-white"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        Approved
                    </button>
                </div>

                {/* Tools List */}
                {isLoadingTools ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-800/30 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : tools.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">
                            {activeTab === 'pending' ? 'All caught up!' : 'No tools yet'}
                        </h2>
                        <p className="text-slate-400">
                            {activeTab === 'pending' ? 'No tools pending approval.' : 'No approved tools found.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {tools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <span className="text-slate-400 text-sm">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                )}

                {/* Edit Modal */}
                {editingTool && (
                    <Dialog open={!!editingTool} onOpenChange={() => setEditingTool(null)}>
                        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-white flex items-center justify-between">
                                    Edit Tool
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Name</Label>
                                    <Input
                                        value={editingTool.name}
                                        onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Description</Label>
                                    <Textarea
                                        value={editingTool.description}
                                        onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">URL</Label>
                                    <Input
                                        value={editingTool.url}
                                        onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Pricing Model</Label>
                                    <Select
                                        value={editingTool.pricingModel}
                                        onValueChange={(value) => setEditingTool({ ...editingTool, pricingModel: value as PricingType })}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="Free" className="text-white">Free</SelectItem>
                                            <SelectItem value="Freemium" className="text-white">Freemium</SelectItem>
                                            <SelectItem value="Paid" className="text-white">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Tool Type</Label>
                                    <Select
                                        value={editingTool.toolType}
                                        onValueChange={(value) => setEditingTool({ ...editingTool, toolType: value as ToolType })}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            {(["cli", "web", "vscode", "jetbrains", "api", "desktop"] as ToolType[]).map(type => (
                                                <SelectItem key={type} value={type} className="text-white capitalize">{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={handleEdit}
                                        disabled={loadingAction === 'edit'}
                                        className="flex-1 bg-linear-to-r from-cyan-500 to-purple-500 text-white"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingTool(null)}
                                        className="border-slate-700 text-slate-300"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}