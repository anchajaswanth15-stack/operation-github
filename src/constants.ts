/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types.ts';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synthwave',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
    duration: 184,
    color: '#8b5cf6', // Violet
  },
  {
    id: '2',
    title: 'Cyber Slither',
    artist: 'Neural Beats',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    duration: 215,
    color: '#10b981', // Emerald
  },
  {
    id: '3',
    title: 'Synth Void',
    artist: 'Binary Echo',
    cover: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=800&q=80',
    duration: 192,
    color: '#ec4899', // Pink
  },
];
