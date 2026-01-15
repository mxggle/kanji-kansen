"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bebas_Neue } from "next/font/google";
import { Heart, Flame } from "lucide-react";
import { useProgressStore } from "@/lib/store";

const bebasNeue = Bebas_Neue({
    weight: "400",
    subsets: ["latin"],
});

export function Header() {
    const { hearts, streak } = useProgressStore();
    const pathname = usePathname();

    // Hide status bar on home page
    const isHomePage = pathname === "/";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="flex items-center justify-between px-6 h-16">
                <div className="pointer-events-auto">
                    <Link href="/" className="font-bold text-2xl tracking-tight text-white flex items-center gap-3">
                        <span className={`${bebasNeue.className} text-[var(--n2)] tracking-wider`} style={{ textShadow: '0 0 8px rgba(244, 114, 182, 0.4), 0 1px 2px rgba(0,0,0,0.9)' }}>Kanji</span>
                        <span className={`${bebasNeue.className} text-[var(--accent)] tracking-wider`} style={{ textShadow: '0 0 10px rgba(46, 255, 255, 0.5), 0 1px 2px rgba(0,0,0,0.9)' }}>Kaisen</span>
                    </Link>
                </div>

                {/* Status Bar - Hidden on home page */}
                {!isHomePage && (
                    <div className="pointer-events-auto flex items-center gap-4 md:gap-6 bg-black/50 backdrop-blur-md px-4 md:px-6 py-2 rounded-full border border-white/10">
                        <div className="flex items-center gap-2 text-rose-500">
                            <Heart size={20} fill="currentColor" className={hearts === 0 ? "text-gray-600" : ""} />
                            <span className="font-bold text-lg">{hearts}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-500">
                            <Flame size={20} fill="currentColor" />
                            <span className="font-bold text-lg">{streak}</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
