/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Track {
  id: string;
  title: string;
  artist: string;
  color: string;
  bpm: number;
}
