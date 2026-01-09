import { KanjiCanvas, KanjiCanvasRef } from "./KanjiCanvas";
import { KanjiData } from "@/types/kanji";
import { ArrowRight, RefreshCw, Lightbulb } from "lucide-react";
import { useRef } from "react";

interface PhasePracticeProps {
    data: KanjiData;
    onNext: () => void;
}

export function PhasePractice({ data, onNext }: PhasePracticeProps) {
    const canvasRef = useRef<KanjiCanvasRef>(null);

    const handleClear = () => {
        canvasRef.current?.clear();
    };

    const handleHint = () => {
        canvasRef.current?.hint();
    };

    return (
        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-bold mb-2 text-zinc-400">Phase 2: Trace</h3>
            <p className="text-sm text-zinc-500 mb-4">Follow the blue guide strokes</p>

            <div className="mb-4 relative">
                <KanjiCanvas
                    ref={canvasRef}
                    kanji={data.char}
                    mode="practice"
                />
            </div>

            {/* Control buttons */}
            <div className="flex gap-3 mb-6 w-full max-w-xs">
                <button
                    onClick={handleClear}
                    className="flex-1 py-2 bg-zinc-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors text-sm"
                >
                    <RefreshCw size={16} />
                    Clear
                </button>
                <button
                    onClick={handleHint}
                    className="flex-1 py-2 bg-zinc-800 text-cyan-400 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors text-sm"
                >
                    <Lightbulb size={16} />
                    Hint
                </button>
            </div>

            <button
                onClick={onNext}
                className="w-full py-4 bg-[var(--accent)] text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-[#1eeeee] transition-colors"
            >
                I'm Ready <ArrowRight />
            </button>
        </div>
    );
}
