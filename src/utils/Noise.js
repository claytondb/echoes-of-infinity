/**
 * Noise.js - Perlin-like noise generation using seeded randomness
 */

import { seededRandom } from './SeededRandom.js';

/**
 * Create a noise generator
 * @param {number} width - Width of the noise field
 * @param {function} rng - Random number generator function
 * @returns {function} Function that takes (x, octaves) and returns 0-1 noise value
 */
export function createNoise(width, rng) {
  // Pre-generate permutation table for consistent noise
  const permTable = [];
  for (let i = 0; i < width; i++) {
    permTable[i] = Math.floor(rng() * 256);
  }

  /**
   * Interpolation function (smooth step)
   */
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Linear interpolation
   */
  function lerp(t, a, b) {
    return a + t * (b - a);
  }

  /**
   * Gradient function
   */
  function grad(hash, x) {
    const h = hash & 15;
    const u = h < 8 ? x : -x;
    return u;
  }

  /**
   * Single octave of Perlin noise
   */
  function noise1d(x) {
    const xi = Math.floor(x) % width;
    const xf = x - Math.floor(x);
    const u = fade(xf);

    const p0 = permTable[xi];
    const p1 = permTable[(xi + 1) % width];

    const g0 = grad(p0, xf);
    const g1 = grad(p1, xf - 1);

    return lerp(u, g0, g1);
  }

  /**
   * Multi-octave noise (Fractional Brownian Motion)
   */
  return function (x, octaves = 4) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * noise1d(x * frequency);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    // Normalize to 0-1
    return (value / maxValue + 1) / 2;
  };
}
