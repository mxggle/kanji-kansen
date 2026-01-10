import { Checkpoint } from "@/lib/checkpoints";
import { CheckpointNode } from "./CheckpointNode";

interface CategorySectionProps {
    title: string;
    checkpoints: Checkpoint[];
    completedCheckpoints: Record<string, boolean>;
    onCheckpointClick: (id: string) => void;
    colorTheme: "Nature & Elements" | "Human Body & People" | "Action & Movement" | "Structures & Home" | "Animals & Wildlife" | "Tools & Weapons" | "Communication & Thought" | "Textiles, Plants & Food" | "States & Attributes" | "Time & Sequence" | "Others";
    startIndex: number;
}

const THEME_STYLES: Record<string, { bg: string, border: string, title: string, gradient: string }> = {
    "Nature & Elements": {
        bg: "bg-emerald-950/30",
        border: "border-emerald-800/50",
        title: "text-emerald-400",
        gradient: "from-emerald-900/20 to-transparent",
    },
    "Human Body & People": {
        bg: "bg-blue-950/30",
        border: "border-blue-800/50",
        title: "text-blue-400",
        gradient: "from-blue-900/20 to-transparent",
    },
    "Action & Movement": {
        bg: "bg-red-950/30",
        border: "border-red-800/50",
        title: "text-red-400",
        gradient: "from-red-900/20 to-transparent",
    },
    "Structures & Home": {
        bg: "bg-stone-950/30",
        border: "border-stone-800/50",
        title: "text-stone-400",
        gradient: "from-stone-900/20 to-transparent",
    },
    "Animals & Wildlife": {
        bg: "bg-amber-950/30",
        border: "border-amber-800/50",
        title: "text-amber-400",
        gradient: "from-amber-900/20 to-transparent",
    },
    "Tools & Weapons": {
        bg: "bg-slate-950/30",
        border: "border-slate-800/50",
        title: "text-slate-400",
        gradient: "from-slate-900/20 to-transparent",
    },
    "Communication & Thought": {
        bg: "bg-purple-950/30",
        border: "border-purple-800/50",
        title: "text-purple-400",
        gradient: "from-purple-900/20 to-transparent",
    },
    "Textiles, Plants & Food": {
        bg: "bg-lime-950/30",
        border: "border-lime-800/50",
        title: "text-lime-400",
        gradient: "from-lime-900/20 to-transparent",
    },
    "States & Attributes": {
        bg: "bg-pink-950/30",
        border: "border-pink-800/50",
        title: "text-pink-400",
        gradient: "from-pink-900/20 to-transparent",
    },
    "Time & Sequence": {
        bg: "bg-indigo-950/30",
        border: "border-indigo-800/50",
        title: "text-indigo-400",
        gradient: "from-indigo-900/20 to-transparent",
    },
    "Others": {
        bg: "bg-zinc-900/30",
        border: "border-zinc-800/50",
        title: "text-zinc-400",
        gradient: "from-zinc-900/20 to-transparent",
    },
};

export function CategorySection({
    title,
    checkpoints,
    completedCheckpoints,
    onCheckpointClick,
    colorTheme,
    startIndex
}: CategorySectionProps) {
    const theme = THEME_STYLES[colorTheme] || THEME_STYLES["Others"];

    return (
        <section className={`w-full max-w-2xl mx-auto mb-12 rounded-3xl overflow-hidden border ${theme.border} ${theme.bg} backdrop-blur-sm relative`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} pointer-events-none`} />

            {/* Title Header */}
            <div className="relative px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <h2 className={`text-xl font-bold ${theme.title} tracking-wide uppercase`}>{title}</h2>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/30 text-xs font-mono">{checkpoints.length} RADICALS</span>
            </div>

            {/* Checkpoints Grid/Path */}
            <div className="relative p-6 flex flex-col items-center gap-6">
                {checkpoints.map((checkpoint, localIndex) => {
                    const globalIndex = startIndex + localIndex;
                    // Simplify unlocking logic: 
                    // Unlocked if it's the very first one globally (index 0)
                    // OR if the *previous* checkpoint (globally) is completed.
                    // Ideally we should pass the full list or a lookup to check previous status properly.
                    // But here we rely on the parent or store to know global state.

                    // Actually, 'completedCheckpoints' tells us if THIS one is done.
                    // To know if it's UNLOCKED, we usually look at the previous one.
                    // Let's passed `isUnlocked` from parent or compute it here?
                    // Computing "is previous completed" requires access to previous checkpoint's ID.

                    // If we group them, the array passed here is just a slice.
                    // We need to know previous checkpoint ID even outside this group.

                    // For now, let's just make them ALL unlocked for testing UI layout validation?
                    // OR better: pass `isUnlocked` map or function.

                    // Let's assume passed Checkpoint object has everything or we pass a generic check.
                    // Let's handle isUnlocked in the parent map and pass it down ? 
                    // No, `render` is cleaner here.

                    // Hack for now: Pass a `isPreviousCompleted` prop?
                    // Let's simplify: passed checkpoints normally. 
                    // The parent component should probably calculate "isUnlocked" state for every checkpoint first, 
                    // then pass it down.

                    const isCompleted = !!completedCheckpoints[checkpoint.id];
                    // We'll leave lock logic to the parent wrapper or just default to True for now to see layout.

                    return (
                        <CheckpointNode
                            key={checkpoint.id}
                            index={globalIndex}
                            checkpoint={checkpoint}
                            isLocked={false} // Placeholder, will fix in page integration
                            isCompleted={isCompleted}
                            onClick={() => onCheckpointClick(checkpoint.id)}
                        />
                    );
                })}
            </div>
        </section>
    );
}
