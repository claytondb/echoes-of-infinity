/**
 * WorldGenerator.js - Procedural world generation
 */

import { TILES, TILE_PROPERTIES } from '../data/TileTypes.js';
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../data/GameConfig.js';
import { seededRandom } from '../utils/SeededRandom.js';
import { createNoise } from '../utils/Noise.js';

/**
 * Generate a complete game world
 * @param {object} branchData - Branch configuration with seed and properties
 * @returns {object} { tiles: 2D array, stars: array, branchData }
 */
export function generateWorld(branchData) {
  const rng = seededRandom(branchData.seed);
  const noise = createNoise(WORLD_WIDTH, rng);

  // Initialize tile array
  const tiles = Array.from({ length: WORLD_HEIGHT }, () =>
    Array.from({ length: WORLD_WIDTH }, () => TILES.AIR)
  );

  // Phase 1: Terrain height using noise
  const surfaceHeights = [];
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const terrainNoise = noise(x / 40, 4);
    const height = Math.floor(terrainNoise * 30 + 20);
    surfaceHeights[x] = Math.max(10, Math.min(WORLD_HEIGHT - 5, height));
  }

  // Phase 2: Fill terrain based on height
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const surfaceY = surfaceHeights[x];

    for (let y = surfaceY; y < WORLD_HEIGHT; y++) {
      const depth = y - surfaceY;

      if (depth === 0) {
        tiles[y][x] = TILES.GRASS;
      } else if (depth < 3) {
        tiles[y][x] = TILES.DIRT;
      } else if (depth < 15) {
        tiles[y][x] = TILES.STONE;
        // Scatter crystals in stone layer
        if (rng() < 0.04) {
          tiles[y][x] = TILES.CRYSTAL;
        }
      } else {
        tiles[y][x] = TILES.STONE;
        if (rng() < 0.02) {
          tiles[y][x] = TILES.CRYSTAL;
        }
      }
    }
  }

  // Phase 3: Place plants on surface
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const surfaceY = surfaceHeights[x];
    if (surfaceY > 0 && rng() < 0.06) {
      tiles[surfaceY - 1][x] = TILES.PLANT;
    }
  }

  // Phase 4: Place trees (trunks first, canopy in separate pass)
  const treePositions = [];
  for (let x = 0; x < WORLD_WIDTH; x++) {
    if (rng() < 0.05) {
      const surfaceY = surfaceHeights[x];
      if (surfaceY > 3) {
        const trunkHeight = rng() < 0.5 ? 2 : 3;
        treePositions.push({ x, surfaceY, trunkHeight });

        for (let i = 0; i < trunkHeight; i++) {
          if (surfaceY - 1 - i >= 0) {
            tiles[surfaceY - 1 - i][x] = TILES.WOOD;
          }
        }
      }
    }
  }

  // Phase 5: Place tree canopies (second pass to avoid uninitialized columns)
  treePositions.forEach(({ x, surfaceY, trunkHeight }) => {
    const canopyY = surfaceY - trunkHeight - 1;
    const canopyWidth = 5;
    const canopyWidthTop = 3;

    // Bottom row of canopy (5-wide)
    for (let dx = -2; dx <= 2; dx++) {
      const cx = x + dx;
      if (cx >= 0 && cx < WORLD_WIDTH && canopyY >= 0) {
        if (tiles[canopyY][cx] === TILES.AIR) {
          tiles[canopyY][cx] = TILES.LEAF;
        }
      }
    }

    // Top row of canopy (3-wide)
    if (canopyY - 1 >= 0) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = x + dx;
        if (cx >= 0 && cx < WORLD_WIDTH) {
          if (tiles[canopyY - 1][cx] === TILES.AIR) {
            tiles[canopyY - 1][cx] = TILES.LEAF;
          }
        }
      }
    }
  });

  // Phase 6: Place portals
  const portals = [];
  const numPortals = 2;
  for (let i = 0; i < numPortals; i++) {
    let px = Math.floor(rng() * (WORLD_WIDTH - 20)) + 10;
    let py = surfaceHeights[px] - 2;
    if (py > 0 && py < WORLD_HEIGHT) {
      tiles[py][px] = TILES.PORTAL;
      portals.push({ x: px, y: py });
    }
  }

  // Phase 7: Generate star background
  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: rng() * WORLD_WIDTH * TILE_SIZE,
      y: rng() * 400,
      brightness: 0.3 + rng() * 0.7,
    });
  }

  return {
    tiles,
    stars,
    branchData,
  };
}
