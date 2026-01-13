"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Flame, BookOpen, Brain, Sparkles, Droplets, Laptop, Sword, Mountain } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// Floating Kanji Background Animation
function FloatingKanji() {
    const kanjiChars = [
        "水", "火", "木", "土", "山", "川", "日", "月", "風", "雨",
        "人", "心", "力", "手", "目", "口", "大", "小", "中", "氵"
    ];

    // Memoize particles to prevent re-rendering and blinking
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map(() => ({
            char: kanjiChars[Math.floor(Math.random() * kanjiChars.length)],
            startX: Math.random() * 100,
            startY: 100 + Math.random() * 20,
            endY: -20 - Math.random() * 20,
            duration: 20 + Math.random() * 15,
            delay: Math.random() * 10,
            size: 1.5 + Math.random() * 2,
            opacity: 0.2 + Math.random() * 0.3,
            rotateStart: Math.random() * 360,
            rotateEnd: Math.random() * 360 + 180,
        }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute font-japanese select-none"
                    style={{
                        left: `${particle.startX}%`,
                        fontSize: `${particle.size}rem`,
                        color: `rgba(255, 255, 255, ${particle.opacity})`,
                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                    }}
                    initial={{
                        y: `${particle.startY}vh`,
                        rotate: particle.rotateStart,
                    }}
                    animate={{
                        y: `${particle.endY}vh`,
                        rotate: particle.rotateEnd,
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {particle.char}
                </motion.div>
            ))}
        </div>
    );
}
