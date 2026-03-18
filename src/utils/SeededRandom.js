/**
 * SeededRandom.js - Deterministic pseudorandom number generator
 */

/**
 * Create a seeded random number generator
 * @param {number} seed - The seed value
 * @returns {function} Function that returns pseudorandom numbers 0-1
 */
export function seededRandom(seed) {
  let state = seed;

  return function () {
    // Lehmer random number generator
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
