/**
 * PlayerController.js - Player movement, input, and state management
 */

import { TILES } from '../data/TileTypes.js';
import { MOVE_SPEED, TILE_SIZE } from '../data/GameConfig.js';

export class PlayerController {
  constructor(gameState) {
    this.gameState = gameState;

    // Initialize player state if not present
    if (!gameState.player) {
      gameState.player = {
        x: 100,
        y: 50,
        vx: 0,
        vy: 0,
        w: 16,
        h: 28,
        onGround: false,
        facing: 1, // 1 = right, -1 = left

        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        power: 10,
        attackTimer: 0,
        attackCooldown: 0.5,

        inventory: {},
        equippedTool: null,
        equippedToolDurability: 0,

        visualYOffset: 0,
        visualXOffset: 0,

        invisible: false,
        invisibleTimer: 0,
        invisibleCooldown: 0,

        gauntlet: [null, null, null, null, null],
        ownedStones: [],
        activeStones: [],
      };
    }
  }

  update(world, dt) {
    const player = this.gameState.player;
    const tiles = world.tiles;

    // Handle input
    const keys = this.gameState.keys || {};
    let moveInput = 0;

    if (keys['KeyA']) moveInput -= 1;
    if (keys['KeyD']) moveInput += 1;

    // Apply movement
    if (moveInput !== 0) {
      player.vx = moveInput * MOVE_SPEED;
      player.facing = moveInput > 0 ? 1 : -1;
    } else {
      player.vx *= 0.8;
    }

    // Jump
    if (keys['Space'] && player.onGround) {
      player.vy = -10.5;
      player.onGround = false;
      keys['Space'] = false;
    }

    // Invisibility toggle (Q key)
    if (keys['KeyQ']) {
      this.tryToggleInvisibility(player);
      keys['KeyQ'] = false;
    }

    // Update attack timer
    if (player.attackTimer > 0) {
      player.attackTimer -= dt;
    }

    // Regen stamina
    if (player.stamina < player.maxStamina) {
      player.stamina += 20 * dt;
      if (player.stamina > player.maxStamina) {
        player.stamina = player.maxStamina;
      }
    }

    // Decay visual offsets (step-up tween)
    const offsetDecay = MOVE_SPEED * 0.85 * dt;
    if (Math.abs(player.visualYOffset) > 0.01) {
      player.visualYOffset *= Math.exp(-offsetDecay);
    } else {
      player.visualYOffset = 0;
    }

    if (Math.abs(player.visualXOffset) > 0.01) {
      player.visualXOffset *= Math.exp(-offsetDecay);
    } else {
      player.visualXOffset = 0;
    }

    // Update invisibility timer
    if (player.invisible) {
      player.invisibleTimer -= dt;
      if (player.invisibleTimer <= 0) {
        player.invisible = false;
        player.invisibleTimer = 0;
        player.invisibleCooldown = 10; // 10 second cooldown
      }
    }

    // Decay invisibility cooldown
    if (player.invisibleCooldown > 0) {
      player.invisibleCooldown -= dt;
    }

    // Auto-pickup plants
    const tileX = Math.floor(player.x / TILE_SIZE);
    const tileY = Math.floor(player.y / TILE_SIZE);
    if (
      tileX >= 0 &&
      tileX < tiles[0].length &&
      tileY >= 0 &&
      tileY < tiles.length
    ) {
      if (tiles[tileY][tileX] === TILES.PLANT) {
        tiles[tileY][tileX] = TILES.AIR;
        this.addItemToInventory(TILES.PLANT, 1);
      }
    }
  }

  tryToggleInvisibility(player) {
    // Check if invisibility stone is equipped
    const hasInvisibilityStone = player.gauntlet.some(
      (stoneId) => stoneId === 'invisibility'
    );

    if (
      hasInvisibilityStone &&
      !player.invisible &&
      player.invisibleCooldown <= 0
    ) {
      player.invisible = true;
      player.invisibleTimer = 5;
    }
  }

  addItemToInventory(itemId, count) {
    const player = this.gameState.player;
    if (!player.inventory[itemId]) {
      player.inventory[itemId] = 0;
    }
    player.inventory[itemId] += count;
  }
}
