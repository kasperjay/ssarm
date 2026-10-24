import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NotificationInbox } from "@/components/NotificationInbox";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spectral Soundworks | Lead Workspace",
  description: "Advanced lead workflow and artist intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground min-h-screen flex text-sm selection:bg-accent/30 selection:text-white"
      >
        {/* Premium Ambient Backgrounds */}
        <div className="fixed inset-0 bg-[#08080c] z-[-2]" />
        <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[120%] pointer-events-none z-[-1] opacity-40">
           <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-accent/10 blur-[160px] rounded-full" />
           <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-accent-secondary/10 blur-[160px] rounded-full" />
        </div>

        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        <main className="relative z-0 min-h-screen w-full pb-20 lg:pb-0 lg:pl-24">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0d0d12]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </Link>
          <Link href="/KPIs" className="flex flex-col items-center gap-0.5 text-white/40 hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">KPIs</span>
          </Link>
          <Link href="/leads/discover" className="flex flex-col items-center gap-0.5 text-white/40 hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2"/><path d="m7.8 16.2 2-2"/><path d="m14.5 14.5 2 2"/><path d="m9.5 9.5-2-2"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
          </Link>
          <Link href="/leads" className="flex flex-col items-center gap-0.5 text-white/40 hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Leads</span>
          </Link>
          <Link href="/projects" className="flex flex-col items-center gap-0.5 text-white/40 hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Projects</span>
          </Link>
                    <NotificationInbox placement="top-end" />
        </nav>
      </body>
    </html>
  );
}