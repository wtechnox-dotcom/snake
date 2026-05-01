/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from "./types";

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = "UP";
export const GAME_SPEED = 150;

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Synth Echoes",
    artist: "AI Oracle",
    color: "#ff00ff",
    bpm: 120,
  },
  {
    id: "2",
    title: "Midnight Pulse",
    artist: "Cyber Flow",
    color: "#00ffff",
    bpm: 128,
  },
  {
    id: "3",
    title: "Neon Velocity",
    artist: "Digital Ghost",
    color: "#39ff14",
    bpm: 140,
  },
];
