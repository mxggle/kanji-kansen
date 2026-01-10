
import { Checkpoint } from "@/lib/checkpoints";
import { Lock, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadicalCardProps {
    checkpoint: Checkpoint;
    isLocked: boolean;
    isCompleted: boolean;
    onClick: () => void;
    themeClass: string; // "text-emerald-400 border-emerald-800/50 bg-emerald-950/20"
}

export function RadicalCard({ checkpoint, isLocked, isCompleted, onClick, themeClass }: RadicalCardProps) {
    // Extract base color from themeClass for generic usage if needed, or rely on passed classes.
    // We want a large background radical.

    // Parse the color part from themeClass generally or just accept it works.
    // themeClass example: "text-emerald-400 border-emerald-800/50 bg-emerald-950/20"

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                "relative w-full max-w-2xl h-32 rounded-3xl overflow-hidden border transition-all duration-300 group text-left",
                "hover:scale-[1.02] active:scale-[0.98]",
                isLocked
                    ? "bg-zinc-900/50 border-zinc-800 cursor-not-allowed opacity-60"
                    : `${themeClass} backdrop-blur-sm border-opacity-50 hover:border-opacity-100`
            )}
        >
            {/* Background Watermark Image (The Radical itself) */}
            <div className={cn(
                "absolute -right-4 -bottom-8 text-9xl font-serif opacity-10 pointer-events-none select-none transition-transform duration-500",
                !isLocked && "group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-20"
            )}>
                {checkpoint.radical}
            </div>

            {/* Content Container */}
            <div className="relative h-full px-8 py-6 flex items-center justify-between z-10">
                <div className="flex flex-col h-full justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Icon/Status */}
                        {isLocked ? (
                            <Lock size={16} className="text-zinc-500" />
                        ) : isCompleted ? (
                            <div className="bg-amber-500/20 text-amber-500 p-1 rounded-full">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        ) : (
                            <div className={cn("w-2 h-2 rounded-full", themeClass.split(' ')[0].replace('text-', 'bg-'))} />
                        )}

                        <span className={cn(
                            "text-sm font-bold tracking-widest uppercase opacity-70",
                            isLocked ? "text-zinc-500" : "text-white/60"
                        )}>
                            {checkpoint.level}
                        </span>
                    </div>

                    <h3 className={cn(
                        "text-2xl font-bold tracking-tight",
                        isLocked ? "text-zinc-500" : "text-white"
                    )}>
                        {checkpoint.title}
                    </h3>

                    <p className={cn(
                        "text-sm mt-1",
                        isLocked ? "text-zinc-600" : "text-white/40"
                    )}>
                        {checkpoint.kanji.length} Kanji Unlocked
                    </p>
                </div>

                {/* Right Side: Big Radical Display or Interaction Hint */}
                <div className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 rounded-2xl border", // bg-black/20
                    isLocked ? "border-zinc-800 bg-zinc-800/50 text-zinc-600" : "border-white/10 bg-white/5 backdrop-blur-md"
                )}>
                    <span className="text-3xl font-serif">{checkpoint.radical}</span>
                </div>
            </div>

            {/* Progress Bar for 'Visual' completeness if we had partial progress, 
                but here it's binary. Maybe a bottom highlight line? */}
            {isCompleted && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/50" />
            )}
        </button>
    );
}
