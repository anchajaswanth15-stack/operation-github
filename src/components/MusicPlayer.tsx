/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS } from '../constants.ts';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleNext();
            return 0;
          }
          return p + (100 / (track.duration * 10)); // updating every 100ms
        });
      }, 100);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, track]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSeconds = (progress / 100) * track.duration;

  return (
    <div className="w-full max-w-[400px] glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-30 transition-colors duration-1000"
        style={{ backgroundColor: track.color }}
      />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <motion.div 
              className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-white/10"
              key={track.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <img 
                src={track.cover} 
                alt={track.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              className="absolute -inset-1 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ background: `linear-gradient(45deg, ${track.color}, transparent, ${track.color})` }}
            />
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <motion.h3 
              key={`title-${track.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-bold truncate tracking-tight text-white"
            >
              {track.title}
            </motion.h3>
            <motion.p 
              key={`artist-${track.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]"
            >
              {track.artist}
            </motion.p>
          </div>
        </div>

        {/* Visualizer Simulation */}
        <div className="flex items-end gap-[3px] h-8 px-2 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{ backgroundColor: track.color }}
              animate={{
                height: isPlaying ? [
                  '15%', 
                  `${Math.random() * 80 + 20}%`, 
                  '30%', 
                  `${Math.random() * 60 + 40}%`, 
                  '15%'
                ] : '15%'
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group">
            <motion.div 
              className="absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${progress}%`, backgroundColor: track.color }}
              animate={{ backgroundColor: track.color }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span>{formatTime(currentSeconds)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
             <button className="p-2 text-white/40 hover:text-white transition-colors">
               <Volume2 className="w-4 h-4" />
             </button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrev}
              className="p-2 text-white/60 hover:text-white transition-all transform hover:scale-110"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button 
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl border border-white/10 group overflow-hidden relative"
              style={{ backgroundColor: track.color }}
            >
               <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <div className="relative z-10 text-black">
                 {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
               </div>
            </button>
            <button 
              onClick={handleNext}
              className="p-2 text-white/60 hover:text-white transition-all transform hover:scale-110"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2 text-white/40 hover:text-white transition-colors">
               <Music2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
