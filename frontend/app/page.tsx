"use client"

import { motion } from "framer-motion";
import HeroSection from "./components/home/HeroSection";
import { Button } from "./components/ui/Button";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/Select";
import FilterSidebar from "./components/home/FilterSidebar";
import ToolGrid from "./components/home/ToolGrid";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiltersData } from "./types/filter";
import { toolsService } from "./services/toolsService";
import { useUser } from "./lib/UserContext";
import { cn } from "./lib/utils";
import { useSearchParams } from "next/navigation";


export default function Home() {

  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FiltersData>({ pricing: [], stack: [], type: [] });
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('upvotes');
  const { user, isLoading } = useUser();
  const PAGE_SIZE = 12;

  // Fetch tools
  const { data: toolsPage, } = useQuery({
    queryKey: ["tools", currentPage, filters, searchQuery, sortBy, activeTag],
    queryFn: () => {
      return toolsService.getAll(currentPage, PAGE_SIZE, {
        search: searchQuery || '',
        pricing: filters.pricing[0] || undefined,
        type: filters.type[0] || undefined,
        stack: filters.stack.length > 0 ? filters.stack : undefined,
        sort: sortBy || undefined,
        tag: activeTag || undefined,
      })
    },
  });

  const totalPages = toolsPage?.page?.totalPages || 0;
  const tools = toolsPage?.content || [];

  const handleUpvote = () => {
    queryClient.invalidateQueries({ queryKey: ["tools"] });
  };

  const handleFilterChange = (newFilters: FiltersData) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleTagClick = (tag: string) => {
    const newTag = activeTag === tag ? null : tag;
    setActiveTag(newTag);
    setCurrentPage(0);
  };

  const activeFiltersCount =
    filters.pricing.length +
    filters.stack.length +
    filters.type.length +
    (activeTag ? 1 : 0);

  return (
    <div className="min-h-screen">
      <HeroSection onTagClick={handleTagClick} activeTag={activeTag} />

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
              Displaying <span className="text-white font-medium">{toolsPage?.page?.totalElements || 0}</span> AI tools
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

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              setCurrentPage(0);
            }}>
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
            setFilters={handleFilterChange}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            isMobile={true}
          />

          {/* Tools Grid */}
          <div className="flex-1 min-w-0">
            <ToolGrid
              tools={tools}
              isLoading={isLoading}
              userEmail={user?.email || ""}
              onUpvote={handleUpvote}
            />
          </div>



        </div>
        {/* Paginação */}
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

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                    currentPage === i
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

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
      </div>
    </div>
  );
}
