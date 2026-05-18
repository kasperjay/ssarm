import React from 'react';
import Link from 'next/link';
import { NeonButton } from './NeonButton';

export function Navbar() {
    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-3xl border-b border-white/5 ml-24">
            <div className="px-12 h-24 flex items-center justify-between gap-12">
                {/* Left Section: Context */}
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-white/90">Explore</h1>
                </div>

                {/* Center Section: Search */}
                <div className="flex-1 max-w-2xl relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search artists, leads, or projects..." 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-sm font-medium placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white/10 transition-all"
                    />
                </div>

                {/* Right Section: Utility */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-white/40">
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </button>
                    </div>
                    
                    <div className="h-10 w-px bg-white/5 mx-2" />

                    <Link href="/login" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
