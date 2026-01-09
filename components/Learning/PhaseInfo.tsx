import { KanjiCanvas, KanjiCanvasRef } from "./KanjiCanvas";
import { KanjiData } from "@/types/kanji";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

interface PhaseInfoProps {
    data: KanjiData;
    onNext: () => void;
}

export function PhaseInfo({ data, onNext }: PhaseInfoProps) {
    const canvasRef = useRef<KanjiCanvasRef>(null);

    const handleReplay = () => {
        canvasRef.current?.animate();
    };

    return (
        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-4 text-zinc-400">Phase 1: Memorize</h3>

            <div className="mb-4 relative">
                <KanjiCanvas
                    ref={canvasRef}
                    kanji={data.char}
                    mode="view"
                    animateOnLoad={true}
                />
                {/* Replay button */}
                <button
                    onClick={handleReplay}
                    className="absolute bottom-2 right-2 p-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
                    title="Replay animation"
                >
                    <Play size={16} />
                </button>
            </div>

            <div className="text-center mb-8 space-y-2">
                <h2 className="text-4xl font-bold text-white">{data.meaning}</h2>
                <div className="flex flex-col gap-1 text-zinc-400">
                    <p><span className="text-[var(--n5)]">Onyomi:</span> {data.onyomi.join(", ") || "—"}</p>
                    <p><span className="text-[var(--accent)]">Kunyomi:</span> {data.kunyomi.join(", ") || "—"}</p>
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
            >
                Start Practice <ArrowRight />
            </button>
        </div>
    );
}
