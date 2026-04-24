/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';
import { Github, Twitter, Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#050505_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Zap className="w-6 h-6 text-black fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-display tracking-tight neon-glow-green">NEON_PULSE</h1>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Neural Entertainment System v2.0</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
          <a href="#" className="hover:text-emerald-400 transition-colors">Arcade</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Studio</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Neural_Link</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase">SYS_ONLINE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-8 gap-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Game Window */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center lg:items-end"
          >
             <SnakeGame />
          </motion.section>

          {/* Music Controller Section */}
          <motion.section 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 mb-2">
               <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white/30">Neural_Audio_Interface</h2>
               <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <MusicPlayer />

            {/* Side Information / Extras */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">Tactical_Briefing</h3>
              <ul className="space-y-3 text-[10px] font-mono text-white/50 uppercase leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-emerald-500">01.</span>
                  Consume data fragments (red nodes) to strengthen your signal.
                </li>
                <li className="flex gap-2">
                   <span className="text-emerald-500">02.</span>
                   Avoid wall collisions and self-intersection to maintain system integrity.
                </li>
                <li className="flex gap-2">
                   <span className="text-emerald-500">03.</span>
                   Audio frequencies are optimized for high-concentration maneuvers.
                </li>
              </ul>
            </div>
          </motion.section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-8 py-6 border-t border-white/5 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          <span>© 2026 AI_STUDIO_BUILD</span>
          <span className="hidden md:inline">|</span>
          <span>LATENCY: 12MS</span>
          <span className="hidden md:inline">|</span>
          <span>SYNC: ESTABLISHED</span>
        </div>

        <div className="flex items-center gap-4">
           <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
             <Github className="w-4 h-4" />
           </a>
           <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
             <Twitter className="w-4 h-4" />
           </a>
        </div>
      </footer>
    </div>
  );
}
