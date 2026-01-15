"use client";

import { KanjiData } from "@/types/kanji";
import { cn } from "@/lib/utils";

interface KanjiInfoDisplayProps {
    data: KanjiData;
    className?: string; // Kept for compatibility
}

export function KanjiInfoDisplay({ data, className }: KanjiInfoDisplayProps) {
    return (
        <div className={cn("text-center space-y-2", className)}>
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                    Meaning
                </span>
                <h2 className="text-4xl font-bold text-white leading-none">
                    {data.meaning}
                </h2>
            </div>
            {/* Readings have been moved to KanjiReadingHeader */}
        </div>
    );
}
