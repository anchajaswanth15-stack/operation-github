/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants.ts';
import { Point, Direction } from '../types.ts';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, isPaused, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* HUD */}
      <div className="w-full max-w-[400px] flex justify-between items-center glass-card p-4 rounded-xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">Score</span>
          <span className="text-2xl font-display neon-glow-green text-emerald-400">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xl font-display text-amber-400">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative glass-card rounded-xl border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] overflow-hidden"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-emerald-500/30" />
          ))}
        </div>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className="absolute rounded-sm"
            style={{
              width: 400 / GRID_SIZE - 2,
              height: 400 / GRID_SIZE - 2,
              left: (segment.x * 400) / GRID_SIZE + 1,
              top: (segment.y * 400) / GRID_SIZE + 1,
              backgroundColor: i === 0 ? '#10b981' : '#059669',
              boxShadow: i === 0 ? '0 0 10px #10b981' : 'none',
              zIndex: snake.length - i
            }}
            initial={i === 0 ? { scale: 1.2 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e]"
          style={{
            width: 400 / GRID_SIZE - 6,
            height: 400 / GRID_SIZE - 6,
            left: (food.x * 400) / GRID_SIZE + 3,
            top: (food.y * 400) / GRID_SIZE + 3,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Overlay States */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 text-center p-8"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-display text-rose-500 mb-2 neon-glow-pink">SYSTEM FAILURE</h2>
                  <p className="text-white/70 mb-8 font-mono text-sm leading-relaxed">SNAKE_PROTOCOL_CRASHED: COLLISION_DETECTED</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  >
                    <RefreshCcw className="w-5 h-5" /> REBOOT SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/40">
                    <Gamepad2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-display text-emerald-400 mb-2">NEURAL_STASIS</h2>
                  <p className="text-white/60 mb-10 font-mono text-xs uppercase tracking-[0.2em]">Press SPACE to initialize</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    RESUME PROTOCOL
                  </button>
                  <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                    <div className="text-[10px] text-white/30 uppercase font-mono border-l border-white/10 pl-3">
                      <span className="block text-white/50 mb-1">UP/DOWN/LEFT/RIGHT</span>
                      NAVIGATION
                    </div>
                    <div className="text-[10px] text-white/30 uppercase font-mono border-l border-white/10 pl-3">
                      <span className="block text-white/50 mb-1">SPACE</span>
                      TOGGLE STASIS
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SnakeGame;
