/**
 * BuildSystem.js - Block building and destruction
 */

import { TILES, TILE_PROPERTIES } from '../data/TileTypes.js';
import { TILE_SIZE } from '../data/GameConfig.js';

export class BuildSystem {
  /**
   * Handle click on world while in build mode
   * @param {object} world - World with tiles
   * @param {object} player - Player entity
   * @param {number} wx - World X coordinate (in pixels)
   * @param {number} wy - World Y coordinate (in pixels)
   * @param {string} button - 'left' or 'right'
   * @param {number} selectedSlot - Hotbar slot being used
   * @param {object} inventory - Player inventory
   */
  handleBuildClick(world, player, wx, wy, button, selectedSlot, inventory) {
    const tiles = world.tiles;

    const tileX = Math.floor(wx / TILE_SIZE);
    const tileY = Math.floor(wy / TILE_SIZE);

    // Bounds check
    if (
      tileX < 0 ||
      tileX >= tiles[0].length ||
      tileY < 0 ||
      tileY >= tiles.length
    ) {
      return;
    }

    // Distance check (6 tiles max)
    const dx = tileX * TILE_SIZE + TILE_SIZE / 2 - player.x;
    const dy = tileY * TILE_SIZE + TILE_SIZE / 2 - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 6 * TILE_SIZE) {
      return;
    }

    if (button === 'left') {
      // Place block from inventory
      this.placeBlock(tiles, tileX, tileY, selectedSlot, inventory);
    } else if (button === 'right') {
      // Break block and add to inventory
      this.breakBlock(tiles, tileX, tileY, inventory);
    }
  }

  /**
   * Place a block from inventory
   */
  placeBlock(tiles, tileX, tileY, selectedSlot, inventory) {
    // Don't place on occupied tiles
    if (tiles[tileY][tileX] !== TILES.AIR) {
      return;
    }

    // Get item from hotbar slot
    const itemId = this.getHotbarItemId(inventory, selectedSlot);
    if (itemId === null) {
      return;
    }

    // Check if it's a placeable block (tile type)
    if (
      itemId === TILES.DIRT ||
      itemId === TILES.STONE ||
      itemId === TILES.GRASS ||
      itemId === TILES.WOOD
    ) {
      tiles[tileY][tileX] = itemId;
      if (!inventory[itemId]) {
        inventory[itemId] = 0;
      }
      inventory[itemId] -= 1;
    }
  }

  /**
   * Break a block and add to inventory
   */
  breakBlock(tiles, tileX, tileY, inventory) {
    const tileId = tiles[tileX][tileY];
    const tileProps = TILE_PROPERTIES[tileId];

    if (tileProps && tileProps.miningTime === 0) {
      // Can't break certain tiles
      return;
    }

    // Add to inventory if tile drops something
    if (tileProps && tileProps.mineDrop !== null) {
      if (!inventory[tileProps.mineDrop]) {
        inventory[tileProps.mineDrop] = 0;
      }
      inventory[tileProps.mineDrop] += 1;
    }

    // Remove tile
    tiles[tileY][tileX] = TILES.AIR;
  }

  /**
   * Get item ID from hotbar slot
   */
  getHotbarItemId(inventory, slot) {
    const itemIds = Object.keys(inventory).map(Number);
    if (slot >= 0 && slot < itemIds.length) {
      return itemIds[slot];
    }
    return null;
  }
}
