/**
 * EchoAI.js - Echo (enemy) AI and behavior
 */

import { collideEntity } from './PhysicsSystem.js';
import { TILES } from '../data/TileTypes.js';
import { TILE_SIZE } from '../data/GameConfig.js';

export class EchoAI {
  constructor() {
    this.echoCounter = 0;
  }

  /**
   * Spawn an echo entity
   * @param {object} world - World with tiles
   * @param {number} echoesAbsorbed - Number of echoes player has defeated
   * @param {object} currentBranch - Current branch data
   * @returns {object} Echo entity
   */
  spawnEcho(world, echoesAbsorbed, currentBranch) {
    const tier = Math.floor(echoesAbsorbed / 3) + 1;
    const version = Math.floor(echoesAbsorbed / 10) + 1;
    const minor = echoesAbsorbed % 10;

    // Scale stats by tier
    const baseHp = 30 + tier * 10;
    const basePower = 8 + tier * 2;
    const dropChance = Math.min(0.3 + tier * 0.1, 0.8);

    // Find spawn position (random tile column, on surface)
    const tiles = world.tiles;
    const spawnX = Math.floor(Math.random() * (tiles[0].length - 10)) + 5;
    let spawnY = 30;

    for (let y = 0; y < tiles.length; y++) {
      if (tiles[y][spawnX] !== TILES.AIR) {
        spawnY = y - 1;
        break;
      }
    }

    this.echoCounter++;

    return {
      id: `echo_${this.echoCounter}`,
      x: spawnX * TILE_SIZE + 4,
      y: spawnY * TILE_SIZE,
      vx: 0,
      vy: 0,
      w: 16,
      h: 24,
      hp: baseHp,
      maxHp: baseHp,
      power: basePower,
      attackTimer: 0,
      attackCooldown: 1.2,
      facing: 1,
      state: 'idle',
      stateTimer: 0,
      tier,
      version,
      minor,
      dropChance,
    };
  }

  /**
   * Update echo AI
   * @param {object} world - World
   * @param {object} player - Player entity
   * @param {number} dt - Delta time
   * @param {object} echo - Echo entity
   */
  update(world, player, dt, echo) {
    if (!echo || echo.hp <= 0) return;

    // Don't chase if player is invisible
    if (player.invisible) {
      echo.state = 'idle';
      echo.stateTimer = 0;
      echo.vx *= 0.9;
      collideEntity(echo, world);
      return;
    }

    // Distance to player
    const dx = player.x - echo.x;
    const dy = player.y - echo.y;
    const distX = Math.abs(dx);
    const distY = Math.abs(dy);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // State transitions
    if (distance < 150) {
      echo.state = 'chase';
      echo.stateTimer = 0;
    } else {
      echo.state = 'idle';
      echo.stateTimer += dt;
    }

    // Update attack timer
    if (echo.attackTimer > 0) {
      echo.attackTimer -= dt;
    }

    // Behavior
    if (echo.state === 'chase') {
      // Move toward player
      if (dx > 5) {
        echo.vx = 2.5;
        echo.facing = 1;
      } else if (dx < -5) {
        echo.vx = -2.5;
        echo.facing = -1;
      } else {
        echo.vx *= 0.8;
      }

      // Jump if blocked
      if (
        !echo.onGround &&
        echo.vy > 0 &&
        distance < 100 &&
        Math.random() < 0.3 * dt
      ) {
        echo.vy = -8;
      }

      // Attack if close
      if (distX < 30 && distY < 40 && echo.attackTimer <= 0) {
        echo.attackTimer = echo.attackCooldown;
      }
    } else {
      // Idle wandering
      echo.vx *= 0.9;
      if (echo.stateTimer > 3) {
        const rand = Math.random();
        if (rand < 0.3) {
          echo.vx = 1.5;
          echo.facing = 1;
          echo.stateTimer = 0;
        } else if (rand < 0.6) {
          echo.vx = -1.5;
          echo.facing = -1;
          echo.stateTimer = 0;
        } else if (rand < 0.8 && echo.onGround) {
          echo.vy = -8;
          echo.stateTimer = 0;
        }
      }
    }

    // Physics
    collideEntity(echo, world);
  }
}
