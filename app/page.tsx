"use client";

import { useEffect, useState } from "react";
import { CHECKPOINTS, CATEGORIES } from "@/lib/checkpoints";
import { useProgressStore } from "@/lib/store";
import { CategoryCard } from "@/components/Path/CategoryCard";
import { Heart, Flame } from "lucide-react";

export default function Home() {
  const { hearts, streak, completedCheckpoints, unlockedLevels } = useProgressStore();
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(null);

  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);
  const { checkStreak } = useProgressStore();

  useEffect(() => {
    setMounted(true);
    checkStreak();
  }, [checkStreak]);

  if (!mounted) return null;

  const handleCheckpointClick = (id: string) => {
    setActiveCheckpointId(id);
  };

  const handleCloseModal = () => {
    setActiveCheckpointId(null);
  };

  // Group Checkpoints
  const categories = [
    "Nature & Elements",
    "Human Body & People",
    "Action & Movement",
    "Structures & Home",
    "Animals & Wildlife",
    "Tools & Weapons",
    "Communication & Thought",
    "Textiles, Plants & Food",
    "States & Attributes",
    "Time & Sequence",
    "Others"
  ];
  const groupedCheckpoints: Record<string, typeof CHECKPOINTS> = {};
  return (
    <main className="min-h-screen bg-black text-white pb-20 relative overflow-y-auto pt-24 custom-scrollbar">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto pb-20">
        {CATEGORIES.map((category) => {
          const categoryCheckpoints = CHECKPOINTS.filter(c => (c as any).category === category);
          const completedCount = categoryCheckpoints.filter(c => completedCheckpoints[c.id]).length;

          return (
            <CategoryCard
              key={category}
              title={category}
              checkpoints={categoryCheckpoints}
              completedCount={completedCount}
            />
          );
        })}
      </div>
    </main>
  );
}
