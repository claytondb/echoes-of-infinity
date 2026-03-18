/**
 * MiningSystem.js - Block mining and harvesting
 */

import { TILE_PROPERTIES, TILES } from '../data/TileTypes.js';
import { TILE_SIZE } from '../data/GameConfig.js';

export class MiningSystem {
  constructor() {
    this.currentTarget = null;
    this.targetProgress = 0;
  }

  /**
   * Update mining system
   * @param {object} world - World with tiles
   * @param {object} player - Player entity
   * @param {object} mouseState - {pressed, x, y}
   * @param {object} camera - {x, y, zoom}
   * @param {boolean} buildMode - Whether in build mode
   * @param {number} dt - Delta time
   * @returns {object} {target, progress}
   */
  update(world, player, mouseState, camera, buildMode, dt) {
    const tiles = world.tiles;

    // Convert screen coordinates to world coordinates
    const worldX = (mouseState.x / camera.zoom + camera.x) / TILE_SIZE;
    const worldY = (mouseState.y / camera.zoom + camera.y) / TILE_SIZE;

    const targetTileX = Math.floor(worldX);
    const targetTileY = Math.floor(worldY);

    // Check if target is in valid range
    const dx = targetTileX * TILE_SIZE + TILE_SIZE / 2 - player.x;
    const dy = targetTileY * TILE_SIZE + TILE_SIZE / 2 - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const MAX_MINING_DISTANCE = 6 * TILE_SIZE;

    if (
      buildMode ||
      targetTileX < 0 ||
      targetTileX >= tiles[0].length ||
      targetTileY < 0 ||
      targetTileY >= tiles.length ||
      distance > MAX_MINING_DISTANCE
    ) {
      this.currentTarget = null;
      this.targetProgress = 0;
      return { target: null, progress: 0 };
    }

    const targetTileId = tiles[targetTileY][targetTileX];
    const targetKey = `${targetTileX},${targetTileY}`;

    // Auto-retarget when mouse moves
    if (
      !this.currentTarget ||
      this.currentTarget !== targetKey ||
      tiles[targetTileY][targetTileX] === TILES.AIR
    ) {
      this.currentTarget = targetKey;
      this.targetProgress = 0;
    }

    // Mine if mouse pressed
    if (mouseState.pressed && this.currentTarget === targetKey) {
      const tileProps = TILE_PROPERTIES[targetTileId];

      if (tileProps && tileProps.miningTime > 0) {
        const toolMultiplier = player.equippedTool ? 1.5 : 1.0;
        this.targetProgress += (dt / tileProps.miningTime) * toolMultiplier;

        if (this.targetProgress >= 1) {
          // Harvest tile
          if (tileProps.mineDrop !== null) {
            this.addToInventory(player, tileProps.mineDrop, 1);
          }

          // Remove tile
          tiles[targetTileY][targetTileX] = TILES.AIR;

          // Deduct tool durability
          if (player.equippedTool && player.equippedToolDurability > 0) {
            player.equippedToolDurability -= 1;
          }

          this.targetProgress = 0;
          this.currentTarget = null;
        }
      }
    } else {
      // Decay progress when not mining
      this.targetProgress *= Math.max(0, 1 - dt * 2);
    }

    return {
      target: this.currentTarget,
      progress: this.targetProgress,
    };
  }

  /**
   * Add item to player inventory
   */
  addToInventory(player, itemId, count) {
    if (!player.inventory[itemId]) {
      player.inventory[itemId] = 0;
    }
    player.inventory[itemId] += count;
  }
}
