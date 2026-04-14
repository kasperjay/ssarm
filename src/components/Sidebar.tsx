import React from 'react';
import Link from 'next/link';

const NavIcon = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <div className={`
    h-12 w-12 rounded-[18px] flex items-center justify-center transition-all duration-300 cursor-pointer group relative
    ${active 
      ? 'bg-accent text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]' 
      : 'bg-white/5 text-white/40 hover:bg-accent/20 hover:text-accent hover:rounded-[14px]'}
  `}>
    {active && <div className="absolute -left-4 w-1 h-8 bg-accent rounded-r-full" />}
    {children}
  </div>
);

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 right-0 h-[88px] w-full flex-row md:top-0 md:bottom-0 md:w-24 md:h-auto md:flex-col bg-[#0d0d12] border-t border-white/5 md:border-t-0 z-60 flex items-center justify-around md:justify-start md:py-8 md:gap-10">
      {/* Wave Transition Element - Desktop Only */}
      <div className="hidden md:block absolute top-0 right-[-40px] bottom-0 w-[40px] pointer-events-none overflow-hidden">
        <div className="h-full w-[80px] bg-[#0d0d12] rounded-l-[100%] shadow-[-20px_0_40px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Logo - Hidden on mobile, shown on desktop */}
      <Link href="/" className="group relative hidden md:block">
        <div className="h-14 w-14 rounded-[22px] bg-linear-to-br from-accent to-accent-secondary flex items-center justify-center font-bold text-black shadow-2xl transition-transform group-hover:scale-110">
           S
        </div>
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-row md:flex-col gap-4 sm:gap-6 items-center flex-1 md:flex-none justify-around w-full md:w-auto px-4 md:px-0">
        <Link href="/">
          <NavIcon active>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </NavIcon>
        </Link>
        <Link href="/leads/discover">
          <NavIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2"/><path d="m7.8 16.2 2-2"/><path d="m14.5 14.5 2 2"/><path d="m9.5 9.5-2-2"/><path d="m18.3 12-2.3 0"/><path d="m5.7 12 2.3 0"/><path d="m12 5.7 0 2.3"/><path d="m12 18.3 0 2.3"/></svg>
          </NavIcon>
        </Link>
        <Link href="/leads/drafts">
          <NavIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </NavIcon>
        </Link>
        <Link href="/projects">
          <NavIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          </NavIcon>
        </Link>
      </nav>

      {/* Footer Nav - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex flex-col gap-6 items-center">
        <div className="h-12 w-12 rounded-full border-2 border-accent/30 p-0.5 group cursor-pointer transition-transform hover:scale-110">
          <div className="h-full w-full rounded-full bg-linear-to-tr from-accent-secondary/40 to-accent/40 flex items-center justify-center text-xs font-bold">
            KP
          </div>
        </div>
        <div className="text-white/20 hover:text-white transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>
    </aside>
  );
}
