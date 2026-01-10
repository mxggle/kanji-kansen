
import Link from 'next/link';
import { getCategorySlug } from '@/lib/checkpoints';
import { Checkpoint } from '@/lib/checkpoints';
import {
    TreeDeciduous, Users, Footprints, Home, Bird,
    Sword, MessageCircle, Wheat, Activity, Clock, Box
} from 'lucide-react';

interface CategoryCardProps {
    title: string;
    checkpoints: Checkpoint[];
    completedCount: number;
}

const THEME_STYLES: Record<string, { bg: string, border: string, title: string, icon: any }> = {
    "Nature & Elements": {
        bg: "bg-emerald-950/40 hover:bg-emerald-950/60",
        border: "border-emerald-800/50",
        title: "text-emerald-400",
        icon: TreeDeciduous
    },
    "Human Body & People": {
        bg: "bg-blue-950/40 hover:bg-blue-950/60",
        border: "border-blue-800/50",
        title: "text-blue-400",
        icon: Users
    },
    "Action & Movement": {
        bg: "bg-red-950/40 hover:bg-red-950/60",
        border: "border-red-800/50",
        title: "text-red-400",
        icon: Footprints
    },
    "Structures & Home": {
        bg: "bg-stone-950/40 hover:bg-stone-950/60",
        border: "border-stone-800/50",
        title: "text-stone-400",
        icon: Home
    },
    "Animals & Wildlife": {
        bg: "bg-amber-950/40 hover:bg-amber-950/60",
        border: "border-amber-800/50",
        title: "text-amber-400",
        icon: Bird
    },
    "Tools & Weapons": {
        bg: "bg-slate-950/40 hover:bg-slate-950/60",
        border: "border-slate-800/50",
        title: "text-slate-400",
        icon: Sword
    },
    "Communication & Thought": {
        bg: "bg-purple-950/40 hover:bg-purple-950/60",
        border: "border-purple-800/50",
        title: "text-purple-400",
        icon: MessageCircle
    },
    "Textiles, Plants & Food": {
        bg: "bg-lime-950/40 hover:bg-lime-950/60",
        border: "border-lime-800/50",
        title: "text-lime-400",
        icon: Wheat
    },
    "States & Attributes": {
        bg: "bg-pink-950/40 hover:bg-pink-950/60",
        border: "border-pink-800/50",
        title: "text-pink-400",
        icon: Activity
    },
    "Time & Sequence": {
        bg: "bg-indigo-950/40 hover:bg-indigo-950/60",
        border: "border-indigo-800/50",
        title: "text-indigo-400",
        icon: Clock
    },
    "Others": {
        bg: "bg-zinc-900/40 hover:bg-zinc-900/60",
        border: "border-zinc-800/50",
        title: "text-zinc-400",
        icon: Box
    },
};

export function CategoryCard({ title, checkpoints, completedCount }: CategoryCardProps) {
    const theme = THEME_STYLES[title] || THEME_STYLES["Others"];
    const Icon = theme.icon;
    const slug = getCategorySlug(title);
    const total = checkpoints.length;
    const progress = Math.round((completedCount / total) * 100) || 0;

    return (
        <Link href={`/category/${slug}`}>
            <div className={`
                h-full flex flex-col p-6 rounded-3xl border transition-all duration-300
                ${theme.bg} ${theme.border} backdrop-blur-sm group
                hover:scale-[1.02] active:scale-[0.98]
            `}>
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-black/20 ${theme.title}`}>
                        <Icon size={24} />
                    </div>
                    <span className="text-2xl font-bold opacity-30 group-hover:opacity-50 transition-opacity">
                        {progress}%
                    </span>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${theme.title} tracking-wide`}>
                    {title}
                </h3>

                <div className="mt-auto">
                    <p className="text-white/40 text-sm mb-3">
                        {completedCount} / {total} Radicals
                    </p>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 bg-current ${theme.title}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
