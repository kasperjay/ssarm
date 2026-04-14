import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar"; // Keep for now as top bar if needed

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans", // Now the primary UI font
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display", // Stylized for headings only
  subsets: ["latin"],
});

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
      <body
        className={`${plusJakarta.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground min-h-screen flex text-sm selection:bg-accent/30 selection:text-white`}
      >
        {/* Premium Ambient Backgrounds */}
        <div className="fixed inset-0 bg-[#08080c] z-[-2]" />
        <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[120%] pointer-events-none z-[-1] opacity-40">
           <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-accent/10 blur-[160px] rounded-full" />
           <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-accent-secondary/10 blur-[160px] rounded-full" />
        </div>

        <Sidebar />
        
        <main className="flex-1 relative z-0 min-h-screen pb-24 md:pb-0 md:ml-24">
          {children}
        </main>
      </body>
    </html>
  );
}
