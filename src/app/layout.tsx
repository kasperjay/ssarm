import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spectral Soundworks | Terminal",
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
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} antialiased bg-background text-foreground min-h-screen relative`}
      >
        {/* Persistent Global Background Effects */}
        <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none z-[-1]" />
        <div className="fixed inset-0 scanlines opacity-20 pointer-events-none z-[-1]" />
        <div className="fixed -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />

        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
