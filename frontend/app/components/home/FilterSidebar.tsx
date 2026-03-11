import { ChevronDown, RotateCcw, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "@/app/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "../ui/Checkbox";
import { FILTER_GROUPS as filterGroups } from "@/app/constants/filters";
import { FiltersData } from "@/app/types/filter";

interface FilterSidebarProps {
    filters: FiltersData,
    setFilters: Dispatch<SetStateAction<FiltersData>>,
    isOpen: boolean,
    onClose?: () => void,
    isMobile: boolean;
}

export default function FilterSidebar({ filters, setFilters, isOpen, onClose, isMobile = false }: FilterSidebarProps) {
    const [expandedGroups, setExpandedGroups] = useState(['princing', 'stack', 'type']);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const toggleFilter = (groupId: keyof FiltersData, value: string) => {
        setFilters((prev) => {
            const currentValues = prev[groupId] as string[];
            const isSelected = currentValues.includes(value);
            const newValues = isSelected
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return {
                ...prev,
                [groupId]: newValues
            };
        });
    };

    const clearAllFilters = () => {
        setFilters({ pricing: [], stack: [], type: [] });
    };

    const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

    const sidebarContent = (
        <div className='space-y-6'>

            {/* Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-white'>Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearAllFilters}
                        className='text-slate-400 hover:text-cyan-400 -mr-2'>
                        <RotateCcw className='w-4 h-4 mr-1' />
                        Clear all
                    </Button>
                )}
            </div>

            {/* Filter Groups */}
            {filterGroups.map((group) => {
                const Icon = group.icon;
                const isExpanded = expandedGroups.includes(group.id);
                const activeCount = (filters[group.id] || []).length;

                return (
                    <div key={group.id} className='border-t border-slate-800 pt-4'>
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className='w-full flex items-center justify-between text-left group'
                        >
                            <div className='flex items-center gap-2'>
                                <Icon className='w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors' />
                                <span className='font-medium text-slate-200'>{group.label}</span>
                                {activeCount > 0 && (<span className='px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full'>
                                    {activeCount}
                                </span>)}
                            </div>
                            <ChevronDown
                                className={cn('w-4 h-4 text-slate-500 transition-transform duration-200',
                                    isExpanded && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {
                                isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className='overflow-hidden'
                                    >
                                        <div className='pt-3 space-y-2'>
                                            {group.options.map((option) => {
                                                const isChecked = (filters[group.id] as string[] || []).includes(option.value);
                                                return (
                                                    <label key={option.value} className='flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors'
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() => toggleFilter(group.id, option.value)}
                                                            className='border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500' />
                                                        <span className={cn('text-sm', option.color || 'text-slate-300')}>
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );

    {/*Mobile Sidebar (Overlay)*/ }
    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden'
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className='fixed top-0 left-0 bottom-0 w-80 bg-slate-900 border-r border-slate-800 z-50 lg:hidden overflow-y-auto'
                        >
                            <div className='p-6'>
                                <div className='flex items-center justify-between mb-6'>
                                    <h2 className='text-xl font-bold text-white'>Filters</h2>
                                    <button
                                        onClick={onClose}
                                        className='p-2 rounded-lg hover:bg-slate-800 transition-colors'
                                    >
                                        <X className='w-5 h-5 text-slate-400' />
                                    </button>
                                </div>
                                {sidebarContent}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    {/* Descktop Sidebar */ }
    return (
        <aside className='hidden lg:block w-64 shrink-0'>
            <div className='sticky top-24 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50'>
                {sidebarContent}
            </div>
        </aside>
    )
}