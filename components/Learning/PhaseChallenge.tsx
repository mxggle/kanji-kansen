import { KanjiCanvas, KanjiCanvasRef } from "./KanjiCanvas";
import { KanjiData } from "@/types/kanji";
import { Trash2, Lightbulb, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PhaseChallengeProps {
    data: KanjiData;
    onSuccess: () => void;
    onFail: () => void;
}

export function PhaseChallenge({ data, onSuccess, onFail }: PhaseChallengeProps) {
    const [status, setStatus] = useState<"drawing" | "success" | "fail">("drawing");
    const [showPeek, setShowPeek] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const canvasRef = useRef<KanjiCanvasRef>(null);

    // Auto-hide peek after 1 second
    useEffect(() => {
        if (showPeek) {
            const timer = setTimeout(() => setShowPeek(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [showPeek]);

    const handleComplete = () => {
        console.log("PhaseChallenge: Drawing completed!");
        setStatus("success");
        // Play success feedback
        playSuccessSound();
        setTimeout(onSuccess, 800);
    };

    const handleMistake = () => {
        // The library handles incorrect strokes visually (red flash)
        // We could track mistake count here for the hearts system
        onFail();
    };

    const handleClear = () => {
        canvasRef.current?.clear();
        setStatus("drawing");
    };

    const handleHint = () => {
        canvasRef.current?.hint();
        setHintsUsed(prev => prev + 1);
    };

    const handlePeek = () => {
        setShowPeek(true);
    };

    // Simple audio feedback using Web Audio
    const playSuccessSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
            oscillator.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1); // C#6
            oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.2); // E6

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (e) {
            console.log("Audio not available");
        }
    };

    return (
        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl font-bold mb-2 text-zinc-400">Phase 3: Recall</h3>
            <p className="text-sm text-zinc-500 mb-4">Draw the kanji from memory</p>

            <div className="relative mb-6 border-2 border-dashed border-zinc-700 rounded-xl p-1 bg-black">
                {/* Peek overlay */}
                {showPeek && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 rounded-xl">
                        <span className="text-9xl text-white/80 font-bold">{data.char}</span>
                    </div>
                )}

                <KanjiCanvas
                    ref={canvasRef}
                    kanji={data.char}
                    mode="challenge"
                    onComplete={handleComplete}
                    onMistake={handleMistake}
                />

                {status === "success" && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-500/20 rounded-xl">
                        <span className="text-6xl">✅</span>
                    </div>
                )}
            </div>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{data.meaning}</h2>
                <div className="flex flex-col gap-0.5 text-sm text-zinc-500">
                    <span><span className="text-[var(--n5)]">On:</span> {data.onyomi.join(", ")}</span>
                    <span><span className="text-[var(--accent)]">Kun:</span> {data.kunyomi.join(", ")}</span>
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex gap-3 w-full max-w-xs">
                <button
                    onClick={handleClear}
                    className="flex-1 py-3 bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                    <Trash2 size={18} />
                    Clear
                </button>
                <button
                    onClick={handleHint}
                    className="flex-1 py-3 bg-zinc-800 text-cyan-400 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                    <Lightbulb size={18} />
                    Hint
                </button>
                <button
                    onClick={handlePeek}
                    className="flex-1 py-3 bg-zinc-800 text-amber-400 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                    {showPeek ? <EyeOff size={18} /> : <Eye size={18} />}
                    Peek
                </button>
            </div>

            {hintsUsed > 0 && (
                <p className="text-xs text-zinc-600 mt-3">Hints used: {hintsUsed}</p>
            )}
        </div>
    );
}
