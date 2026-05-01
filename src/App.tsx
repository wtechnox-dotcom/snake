/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Music, 
  Gamepad2, 
  Trophy,
  RefreshCcw,
  Zap
} from "lucide-react";
import { Point, Direction } from "./types";
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED, DUMMY_TRACKS } from "./constants";

export default function App() {
  // Game State
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  // Game Logic
  const getRandomPoint = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomPoint());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, getRandomPoint]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case "arrowup":
        case "w": if (direction !== "DOWN") setDirection("UP"); break;
        case "arrowdown":
        case "s": if (direction !== "UP") setDirection("DOWN"); break;
        case "arrowleft":
        case "a": if (direction !== "RIGHT") setDirection("LEFT"); break;
        case "arrowright":
        case "d": if (direction !== "LEFT") setDirection("RIGHT"); break;
        case " ": setIsPaused(p => !p); break;
        case "r": resetGame(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(getRandomPoint());
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);

  return (
    <div className="h-screen bg-midnight text-slate-300 font-sans flex flex-col overflow-hidden border-4 border-[#1a1a1a] select-none">
      {/* Header Navigation */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-panel shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-cyan to-brand-fuchsia rounded-sm rotate-45 border border-white/20"></div>
          <h1 className="text-xl font-black tracking-widest text-white italic">SYNTH<span className="text-brand-cyan">SNAKE</span></h1>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-[0.2em] text-slate-400">
          <span className="text-brand-cyan border-b border-brand-cyan pb-1 cursor-pointer">ARCADE</span>
          <span className="hover:text-white cursor-pointer transition-colors">LABS</span>
          <span className="hover:text-white cursor-pointer transition-colors">RECORDS</span>
          <span className="hover:text-white cursor-pointer transition-colors">SETTINGS</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <span className="flex items-center"><Zap className="w-3 h-3 mr-1 text-brand-cyan" /> SYS_OK</span>
          <span>v2.4.0</span>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Audio Library */}
        <aside className="hidden lg:flex w-72 border-r border-white/10 bg-sidebar flex-col shrink-0">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mb-4">Audio Library</h2>
            <div className="space-y-3">
              {DUMMY_TRACKS.map((track, index) => (
                <div 
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={`p-3 transition-colors cursor-pointer flex items-center justify-between group ${
                    currentTrackIndex === index ? 'bg-white/5 border-l-2 border-brand-cyan' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className={`text-xs font-bold ${currentTrackIndex === index ? 'text-white' : 'text-slate-300'}`}>{track.title}</p>
                    <p className="text-[10px] text-slate-500 italic truncate">{track.artist}</p>
                  </div>
                  {currentTrackIndex === index && isPlaying ? (
                    <div className="flex gap-0.5 items-end h-3 shrink-0">
                      <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-brand-cyan" />
                      <motion.div animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-brand-cyan" />
                      <motion.div animate={{ height: [6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-brand-cyan" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600">3:42</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto p-6">
            <div className="aspect-square w-full bg-[#111] border border-white/5 rounded relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-fuchsia/10 to-brand-cyan/10"></div>
              <div className="z-10 text-[10px] font-mono text-brand-cyan/50 uppercase tracking-tighter text-center px-4 italic">
                Visualizer Matrix Active<br/>[Processing Beat Sync...]
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between h-12 gap-1 px-4 opacity-30">
                {[...Array(12)].map((_, i) => (
                   <motion.div
                    key={i}
                    animate={{ height: isPlaying ? [10, 40, 20, 50, 10] : [10, 15, 10] }}
                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                    className="w-full bg-slate-700"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Game logic window */}
        <section className="flex-1 bg-midnight relative flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-10 grid-dot"></div>
          
          <div className="relative">
            {/* Score UI */}
            <div className="absolute -top-16 left-0 right-0 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Session Score</p>
                <p className="text-4xl font-black text-white italic">{score.toLocaleString().padStart(6, '0')}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">High Record</p>
                <p className="text-xl font-bold text-brand-fuchsia italic">{highScore.toLocaleString().padStart(6, '0')}</p>
              </div>
            </div>

            {/* Game Board */}
            <div className="relative group">
              <div 
                className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] bg-[#0c0c0c] border border-white/10 relative board-shadow overflow-hidden grid"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {snake.map((segment, i) => (
                  <div
                    key={`${segment.x}-${segment.y}-${i}`}
                    style={{ 
                      gridColumn: segment.x + 1, 
                      gridRow: segment.y + 1,
                      backgroundColor: i === 0 ? "white" : `rgb(34, 211, 238, ${Math.max(0.2, 1 - i/snake.length)})`
                    }}
                    className={`border border-black shadow-[0_0_10px_rgba(34,211,238,0.3)] ${i === 0 ? "z-10 cyan-glow !bg-white" : "z-0"}`}
                  >
                    {i === 0 && (
                      <div className="flex gap-1 items-center justify-center h-full">
                        <div className="w-0.5 h-0.5 bg-black"></div>
                        <div className="w-0.5 h-0.5 bg-black"></div>
                      </div>
                    )}
                  </div>
                ))}
                
                <motion.div
                  animate={{ scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
                  className="bg-brand-fuchsia rounded-full border border-white fuchsia-glow z-20 m-1"
                />

                {/* Scanlines Overlay */}
                <div className="scanlines absolute inset-0 z-40 opacity-20"></div>

                <AnimatePresence>
                  {(isGameOver || isPaused) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
                    >
                      {isGameOver ? (
                        <>
                          <h2 className="text-3xl font-black text-brand-fuchsia italic uppercase mb-2">Neural Fracture</h2>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-6">Connection severed</p>
                          <button onClick={resetGame} className="px-8 py-3 bg-brand-fuchsia text-white font-black italic uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                            Re-Link System
                          </button>
                        </>
                      ) : (
                        <>
                          <h2 className="text-3xl font-black text-brand-cyan italic uppercase mb-2">Process Halted</h2>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-6">Awaiting user input</p>
                          <button onClick={() => setIsPaused(false)} className="px-8 py-3 bg-brand-cyan text-black font-black italic uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                            Continue Task
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls Help */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-8 text-[9px] font-bold text-slate-600 tracking-widest uppercase">
              <span>[WASD] MANEUVER</span>
              <span>[SPACE] SUSPEND</span>
              <span>[R] RESET</span>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Data */}
        <aside className="hidden xl:flex w-64 border-l border-white/10 bg-sidebar p-6 flex-col shrink-0">
          <h2 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mb-6">System Data</h2>
          <div className="space-y-6">
            <div>
              <label className="text-[9px] text-slate-600 block mb-2 font-bold uppercase tracking-widest text-[8px]">Processor Entropy</label>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: isPaused ? "10%" : "42%" }} className="h-full bg-brand-cyan" />
              </div>
            </div>
            <div>
              <label className="text-[9px] text-slate-600 block mb-2 font-bold uppercase tracking-widest text-[8px]">Beat Alignment</label>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: isPlaying ? "88%" : "5%" }} className="h-full bg-brand-fuchsia" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-tighter">Memory Registry</p>
              <ul className="space-y-2 text-[11px] font-mono">
                <li className="flex justify-between items-center"><span className="text-brand-cyan">01. NEON_V</span> <span className="text-slate-400">2,450</span></li>
                <li className="flex justify-between items-center"><span className="text-slate-500">02. GHOST_X</span> <span className="text-slate-400">1,822</span></li>
                <li className="flex justify-between items-center"><span className="text-slate-500">03. USER_0</span> <span className="text-slate-400">{highScore}</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-auto space-y-4">
             <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/10 rounded">
                <p className="text-[9px] font-mono text-brand-cyan/50 leading-relaxed italic">
                  [SYSTEM_STATUS]: All modules operating within nominal parameters. Neural sync stable.
                </p>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer: Media Player */}
      <footer className="h-24 bg-panel border-t border-white/10 flex items-center px-10 gap-12 shrink-0">
        {/* Track Info */}
        <div className="hidden md:block w-64">
          <p className="text-xs font-black text-white uppercase italic truncate tracking-wider">{currentTrack.title}</p>
          <p className="text-[10px] text-slate-500 font-bold tracking-tighter uppercase">{currentTrack.artist} // NEURAL_PROC</p>
        </div>

        {/* Main Controls */}
        <div className="flex-1 flex flex-col items-center gap-3 max-w-xl mx-auto">
          <div className="flex items-center gap-8">
            <button onClick={prevTrack} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full border-2 border-brand-cyan flex items-center justify-center text-brand-cyan hover:bg-brand-cyan hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
          <div className="w-full flex items-center gap-4">
            <span className="text-[9px] font-mono text-slate-600">1:45</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
              <motion.div 
                animate={{ x: isPlaying ? "0%" : "-45%" }}
                className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-fuchsia"
              />
            </div>
            <span className="text-[9px] font-mono text-slate-600">3:52</span>
          </div>
        </div>

        {/* Volume/Tools */}
        <div className="hidden md:flex w-64 items-center justify-end gap-6 text-slate-500">
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4" />
            <div className="w-24 h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
              <div className="h-full w-2/3 bg-slate-400"></div>
            </div>
          </div>
          <button onClick={() => setIsPaused(p => !p)} className="hover:text-brand-cyan transition-colors cursor-pointer">
            <Gamepad2 className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

