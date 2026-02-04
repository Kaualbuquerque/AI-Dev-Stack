'use client'

import { Brain, Search, Sparkles, Menu, X, Compass, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';
import { createPageUrl } from '@/app/utils';
import { useEffect, useState } from 'react';

export default function Header() {

    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if((e.metaKey || e.ctrlKey) && e.key === 'k'){
                e.preventDefault();
                setSearchOpen(true);
            }
            if(e.key === 'Escape'){
                setSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown',handleKeyDown);
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={createPageUrl('Home')} className="flex items-center gap-2 group">
                        <div className="relative">
                            <Brain className="w-8 h-8 text-cyan-400 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                        </div>
                        <span className="text-lg font-bold tracking-tight hidden sm:block">
                            AI-Dev <span className="gradient-text">Stack</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                        >
                            <Search className="w-4 h-4" />
                            <span className="flex-1 text-left text-sm">Search AI tools...</span>
                            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-700 rounded">
                                <span className="text-[10px]">⌘</span>K
                            </kbd>
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link href={createPageUrl('Home')}>
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Compass className="w-4 h-4 mr-2" />
                                Explore
                            </Button>
                        </Link>
                        <Link href={createPageUrl('Community')}>
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Users className="w-4 h-4 mr-2" />
                                Community
                            </Button>
                        </Link>
                        <Link href={createPageUrl('SuggestTool')}>
                            <Button className="bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Suggest Tool
                            </Button>
                        </Link>
                        {user ? (
                            <Link href={createPageUrl('Profile')}>
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-medium cursor-pointer hover:scale-105 transition-transform">
                                    {user || 'U'}
                                </div>
                            </Link>
                        ) : (
                            <Button
                                variant="outline"
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Sign In
                            </Button>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className='md:hidden glass-effect border-t border-slate-800'>
                        <div className='px-4 py-4 space-y-3'>
                            <Button
                                onClick={() => { setSearchOpen(true); setMobileMenuOpen(false) }}
                                className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400'
                            >
                                <Search className='w-4 h-4' />
                                <span>Search AI tools</span>
                            </Button>

                            <Link href={createPageUrl('Home')} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant='ghost' className='w-full justify-start text-slate-300'>
                                    <Compass className='w-4 h-3 mr-2' />
                                    Explore
                                </Button>
                            </Link>

                            <Link href={createPageUrl('Community')} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant='ghost' className='w-full justify-start text-slate-300'>
                                    <Users className='w-4 h-3 mr-2' />
                                    Community
                                </Button>
                            </Link>

                            <Link href={createPageUrl('SuggestTool')} onClick={() => setMobileMenuOpen(false)}>
                                <Button className='w-full bg-linear-to-r from-cyan-500 to-purple-500'>
                                    <Sparkles className='w-4 h-3 mr-2' />
                                    Suggest Tool
                                </Button>
                            </Link>
                        </div>
                    </div>
                )
            }
        </header>
    );
}