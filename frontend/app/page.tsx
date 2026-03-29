"use client"

import { motion } from "framer-motion";
import HeroSection from "./components/home/HeroSection";
import { Button } from "./components/ui/Button";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/Select";
import FilterSidebar from "./components/home/FilterSidebar";
import ToolGrid from "./components/home/ToolGrid";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiltersData } from "./types/filter";
import { Tools, toolsService } from "./services/toolsService";
import { useUser } from "./lib/UserContext";


export default function Home() {

  const [filters, setFilters] = useState<FiltersData>({ pricing: [], stack: [], type: [] });
  const [sortBy, setSortBy] = useState('upvotes');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user, isLoading } = useUser();

  // Fetch tools
  const {
    data: tools = [],
  } = useQuery<Tools[]>({
    queryKey: ["tools"],
    queryFn: () => toolsService.getAll().then(res => res.content || []),
    // O "select" intercepta o dado e o entrega ordenado para a variável "tools"
    select: (data) => [...data].sort((a, b) => b.upvotesCount - a.upvotesCount),
  });



  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool =>
        tool.name?.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    // Tag filter from hero
    if (activeCat) {
      result = result.filter(tool =>
        tool.categories?.some(cat => cat.name.toLowerCase().includes(activeCat.toLowerCase()))
      );
    }

    // Pricing filter
    if (filters.pricing.length > 0) {
      result = result.filter(tool => filters.pricing.includes(tool.pricingModel));
    }


    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(tool => filters.type.includes(tool.toolType));
    }

    // Sort
    switch (sortBy) {
      case 'upvotes':
        result.sort((a, b) => (b.upvotesCount || 0) - (a.upvotesCount || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return result;
  }, [tools, searchQuery, activeCat, filters, sortBy]);

  const handleUpvote = (toolId: number, newUpvotesCount: number, newVotedByMe: boolean) => {
    queryClient.setQueryData<Tools[]>(['tools'], (oldTools) =>
      oldTools?.map(tool =>
        tool.id === toolId
          ? { ...tool, upvotesCount: newUpvotesCount, votedByMe: newVotedByMe }
          : tool
      )
    );
  };

  const handleCatClick = (cat: any) => {
    setActiveCat(activeCat === cat ? null : cat);
  };

  const activeFiltersCount =
    filters.pricing.length +
    filters.stack.length +
    filters.type.length +
    (activeCat ? 1 : 0);

  return (
    <div className="min-h-screen">
      <HeroSection onTagClick={handleCatClick} activeCat={activeCat} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <span className="text-slate-400 text-sm">
              Displaying <span className="text-white font-medium">{filteredTools.length}</span> AI tools
            </span>
          </div>

          <div className="flex items-center gap-3">
            {searchQuery && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{searchQuery}</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    window.history.replaceState({}, '', window.location.pathname);
                  }}
                  className="ml-1 text-slate-500 hover:text-slate-300"
                >
                  ×
                </button>
              </div>
            )}

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-slate-800/50 border-slate-700 text-slate-300">
                <ArrowUpDown className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="upvotes">Top Rated</SelectItem>
                <SelectItem value="newest">Most Recent</SelectItem>
                <SelectItem value="name">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={true}
            isMobile={false}

          />

          {/* Mobile Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            isMobile={true}
          />

          {/* Tools Grid */}
          <div className="flex-1 min-w-0">
            <ToolGrid
              tools={filteredTools}
              isLoading={isLoading}
              userEmail={user?.email || ""}
              onUpvote={handleUpvote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
