/**
 * PhysicsSystem.js - Physics and collision handling
 */

import { TILE_PROPERTIES, TILES } from '../data/TileTypes.js';
import { GRAVITY, WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../data/GameConfig.js';

/**
 * Check if a tile is solid
 */
function isSolid(tiles, x, y) {
  if (x < 0 || x >= tiles[0].length || y < 0 || y >= tiles.length) {
    return true; // World boundaries are solid
  }
  const tileId = tiles[Math.floor(y)][Math.floor(x)];
  return TILE_PROPERTIES[tileId]?.solid ?? false;
}

/**
 * Collide entity with world and update position
 * @param {object} entity - Entity with x, y, vx, vy, w, h, onGround
 * @param {object} world - World with tiles array
 * @returns {object} Updated entity
 */
export function collideEntity(entity, world) {
  const tiles = world.tiles;
  const TILE_PX = TILE_SIZE; // pixels per tile (use GameConfig constant)
  const SUBSTEPS = 4;

  // Apply gravity
  entity.vy += GRAVITY;

  // Substep physics for stable collision
  const dt = 1 / SUBSTEPS;
  for (let sub = 0; sub < SUBSTEPS; sub++) {
    // Horizontal movement
    const nextX = entity.x + entity.vx * dt;

    let canMoveX = true;
    const checkLeftX = nextX;
    const checkRightX = nextX + entity.w;

    const topY = entity.y;
    const bottomY = entity.y + entity.h;

    const tileTop = Math.floor(topY / TILE_PX);
    const tileBottom = Math.floor(bottomY / TILE_PX);

    if (entity.vx > 0) {
      // Moving right
      const checkX = Math.floor(checkRightX / TILE_PX);
      for (let ty = tileTop; ty <= tileBottom; ty++) {
        if (isSolid(tiles, checkX, ty)) {
          canMoveX = false;
          break;
        }
      }
    } else if (entity.vx < 0) {
      // Moving left
      const checkX = Math.floor(checkLeftX / TILE_PX);
      for (let ty = tileTop; ty <= tileBottom; ty++) {
        if (isSolid(tiles, checkX, ty)) {
          canMoveX = false;
          break;
        }
      }
    }

    if (canMoveX) {
      entity.x = nextX;
    } else {
      entity.vx = 0;
    }

    // Vertical movement and auto-step
    const nextY = entity.y + entity.vy * dt;

    let canMoveY = true;
    const checkTopY = nextY;
    const checkBottomY = nextY + entity.h;

    const tileLeft = Math.floor(entity.x / TILE_PX);
    const tileRight = Math.floor((entity.x + entity.w) / TILE_PX);

    if (entity.vy > 0) {
      // Moving down
      const checkY = Math.floor(checkBottomY / TILE_PX);
      for (let tx = tileLeft; tx <= tileRight; tx++) {
        if (isSolid(tiles, tx, checkY)) {
          canMoveY = false;
          entity.onGround = true;
          break;
        }
      }
    } else if (entity.vy < 0) {
      // Moving up
      const checkY = Math.floor(checkTopY / TILE_PX);
      for (let tx = tileLeft; tx <= tileRight; tx++) {
        if (isSolid(tiles, tx, checkY)) {
          canMoveY = false;
          entity.vy = 0;
          break;
        }
      }
    }

    if (canMoveY) {
      entity.y = nextY;
      entity.onGround = false;
    } else {
      entity.vy = 0;
    }

    // Auto-step: if moving horizontally and hit a wall, try stepping up
    if (!canMoveX && entity.onGround && entity.vx !== 0) {
      const stepHeight = TILE_PX;
      const testY = entity.y - stepHeight;

      // Check if there's air above current position
      if (testY >= 0) {
        let canStep = true;
        for (let tx = tileLeft; tx <= tileRight; tx++) {
          if (isSolid(tiles, tx, Math.floor(testY / TILE_PX))) {
            canStep = false;
            break;
          }
        }

        if (canStep) {
          // Check if there's ground after stepping
          const stepTestY = testY + entity.h;
          let hasGround = false;
          for (let tx = tileLeft; tx <= tileRight; tx++) {
            if (isSolid(tiles, tx, Math.floor(stepTestY / TILE_PX))) {
              hasGround = true;
              break;
            }
          }

          if (hasGround) {
            // Perform step
            entity.y = testY;
            entity.onGround = true;
            entity.vy = 0;
            entity.visualYOffset = -stepHeight;
            entity.visualXOffset = entity.vx > 0 ? stepHeight : -stepHeight;
          }
        }
      }
    }
  }

  // World boundary clamping
  if (entity.x < 0) entity.x = 0;
  if (entity.x + entity.w > WORLD_WIDTH * TILE_SIZE) {
    entity.x = WORLD_WIDTH * TILE_SIZE - entity.w;
  }

  // Respawn if fell off bottom
  if (entity.y > WORLD_HEIGHT * TILE_SIZE) {
    entity.x = 100;
    entity.y = 50;
    entity.vx = 0;
    entity.vy = 0;
    entity.onGround = false;
  }

  return entity;
}
