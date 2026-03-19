/**
 * GameScene.js - Main game scene with all systems integrated
 */

import Phaser from 'phaser';
import { generateWorld } from '../systems/WorldGenerator.js';
import { PlayerController } from '../systems/PlayerController.js';
import { EchoAI } from '../systems/EchoAI.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { MiningSystem } from '../systems/MiningSystem.js';
import { BuildSystem } from '../systems/BuildSystem.js';
import { craft as craftItem, getRecipes, getRecipeById } from '../systems/CraftingSystem.js';
import { addItem } from '../systems/InventorySystem.js';
import { GauntletSystem } from '../systems/GauntletSystem.js';
import { CameraController } from '../systems/CameraController.js';
import { PortalTransition } from '../systems/PortalTransition.js';
import { collideEntity } from '../systems/PhysicsSystem.js';
import { BRANCHES, getBranch } from '../data/BranchData.js';
import { TILES, TILE_COLORS, TILE_PROPERTIES } from '../data/TileTypes.js';
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, GAME_VERSION } from '../data/GameConfig.js';
import { POWER_STONES } from '../data/StoneData.js';
import {
  updateHUD,
  updateGauntletUI,
  showMessage,
  updateBattleUI,
  populateInventoryModal,
  populateCraftingModal,
  populateGauntletModal,
  updateLedgerModal,
} from '../ui/HUD.js';
import { ITEM_ICONS } from '../data/Recipes.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Initialize game state
    this.gameState = {
      player: null,
      echo: null,
      currentBranch: getBranch('origin'),
      currentWorld: null,
      worlds: {}, // Cache of generated worlds by branch ID
      keys: {},
      mouseState: {
        pressed: false,
        x: 0,
        y: 0,
      },
      echoesAbsorbed: 0,
      worldsExplored: 1,
      totalDistance: 0,
      gameVersion: GAME_VERSION,
      buildMode: false,
      selectedHotbarSlot: 0,
      turnBattle: null,
      pickupItems: [],
    };

    // Initialize systems
    this.playerController = new PlayerController(this.gameState);
    this.echoAI = new EchoAI();
    this.combatSystem = new CombatSystem();
    this.miningSystem = new MiningSystem();
    this.buildSystem = new BuildSystem();
    this.gauntletSystem = new GauntletSystem();
    this.cameraController = new CameraController();
    this.portalTransition = new PortalTransition();

    // Create graphics object for rendering
    // scrollFactor(0) so the custom cameraController offsets are not double-applied
    this.graphics = this.add.graphics();
    this.graphics.setScrollFactor(0);

    // ---- Text pool ----
    // Pre-allocate reusable Text objects to replace g.fillText() calls.
    // All pool texts use scrollFactor(0) so they stay in screen space.
    this._textPool = [];
    this._textPoolUsed = 0;
    const TEXT_POOL_SIZE = 60;
    for (let i = 0; i < TEXT_POOL_SIZE; i++) {
      const t = this.add.text(0, 0, '', {
        fontSize: '13px',
        color: '#ffffff',
        fontFamily: 'Courier New',
      });
      t.setScrollFactor(0);
      t.setDepth(10);
      t.setVisible(false);
      this._textPool.push(t);
    }

    // Generate origin world
    this.generateWorld('origin');

    // Spawn player on the actual terrain surface at tile X=30
    const spawnTileX = 30;
    const spawnSurface = this.gameState.currentWorld.surfaceHeights
      ? this.gameState.currentWorld.surfaceHeights[spawnTileX]
      : 20;
    this.gameState.player.x = spawnTileX * TILE_SIZE;
    this.gameState.player.y = (spawnSurface - 2) * TILE_SIZE; // 2 tiles above surface

    // Give starter items
    this.gameState.player.inventory[TILES.STONE] = 15;
    this.gameState.player.inventory[TILES.WOOD] = 10;

    // Spawn wooden stick pickup
    const pickupX = (35 * TILE_SIZE) + 12;
    const pickupY = 15 * TILE_SIZE;
    this.gameState.pickupItems.push({
      x: pickupX,
      y: pickupY,
      vx: 0,
      vy: 0,
      itemId: 101, // Wooden stick
      bobPhase: Math.random() * Math.PI * 2,
    });

    // Spawn first echo
    this.gameState.echo = this.echoAI.spawnEcho(
      this.gameState.currentWorld,
      this.gameState.echoesAbsorbed,
      this.gameState.currentBranch
    );

    // Set up input
    this.setupInput();

    // Set up DOM event listeners for modals
    this.setupModalListeners();

    // Initialize HUD
    updateHUD(this.gameState);
    updateGauntletUI(this.gameState);
  }

  /**
   * Grab a text object from the pool and configure it.
   * Returns null if the pool is exhausted.
   */
  _getPoolText(x, y, text, color = '#ffffff', fontSize = '13px') {
    if (this._textPoolUsed >= this._textPool.length) return null;
    const t = this._textPool[this._textPoolUsed++];
    t.setPosition(x, y);
    t.setText(text);
    t.setStyle({ color, fontSize, fontFamily: 'Courier New' });
    t.setVisible(true);
    return t;
  }

  update(time, delta) {
    const dt = delta / 1000; // Convert to seconds

    // Handle portal transition
    if (this.portalTransition.isActive()) {
      this.portalTransition.update(dt);
      this.handlePortalTransition();

      // Skip normal updates during portal transition
      if (this.portalTransition.isActive()) {
        this.renderWorld();
        return;
      }
    }

    // Skip player/echo updates if in turn battle
    if (!this.gameState.turnBattle || !this.gameState.turnBattle.isActive) {
      // Update player
      this.playerController.update(this.gameState.currentWorld, dt);

      // Apply physics to player
      collideEntity(this.gameState.player, this.gameState.currentWorld);

      // Update echo AI
      if (this.gameState.echo && this.gameState.echo.hp > 0) {
        this.echoAI.update(this.gameState.currentWorld, this.gameState.player, dt, this.gameState.echo);
      }

      // Update mining system
      this.miningSystem.update(
        this.gameState.currentWorld,
        this.gameState.player,
        this.gameState.mouseState,
        this.cameraController,
        this.gameState.buildMode,
        dt
      );

      // Update pickup items
      this.updatePickupItems(dt);

      // Check if player is in range of echo for combat
      if (this.gameState.echo && this.gameState.echo.hp > 0) {
        const dx = this.gameState.echo.x - this.gameState.player.x;
        const dy = this.gameState.echo.y - this.gameState.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Start turn battle if time warp stone is equipped
        if (distance < 30 && this.combatSystem.isTimeWarpEquipped(this.gameState.player)) {
          if (!this.gameState.turnBattle) {
            this.gameState.turnBattle = this.combatSystem.startTurnBattle(
              this.gameState.player,
              this.gameState.echo
            );
            updateBattleUI(this.gameState.turnBattle, this.gameState.player, this.gameState.echo);
          }
        }

        // Check for echo death
        if (this.gameState.echo.hp <= 0) {
          this.handleEchoDefeat();
        }
      }
    }

    // Update camera
    this.cameraController.update(
      this.gameState.player,
      this.gameState.echo,
      this.cameras.main.width,
      this.cameras.main.height
    );

    // NOTE: We do NOT call setScroll/setZoom here because the graphics and text objects
    // all use setScrollFactor(0) and render in screen-space via manual offset math.

    // Check portal interaction (E key)
    if (this.gameState.keys['KeyE']) {
      this.checkPortalInteraction();
      this.gameState.keys['KeyE'] = false;
    }

    // Render world
    this.renderWorld();

    // Update HUD
    updateHUD(this.gameState);
  }

  // ===== WORLD GENERATION =====

  generateWorld(branchId) {
    const branch = getBranch(branchId);
    if (!branch) {
      console.error(`Branch ${branchId} not found`);
      return;
    }

    // Check if already generated
    if (this.gameState.worlds[branchId]) {
      this.gameState.currentWorld = this.gameState.worlds[branchId];
      return;
    }

    // Generate new world
    const world = generateWorld(branch);
    this.gameState.worlds[branchId] = world;
    this.gameState.currentWorld = world;
    this.gameState.currentBranch = branch;
  }

  // ===== INPUT HANDLING =====

  setupInput() {
    const keys = [
      'KeyA', 'KeyD', 'Space', 'KeyE', 'KeyQ', 'KeyB', 'KeyG', 'KeyC', 'KeyI', 'KeyM', 'KeyL', 'Escape', 'Tab',
      'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9',
    ];

    keys.forEach((key) => {
      const keyObj = this.input.keyboard.addKey(key);
      keyObj.on('down', () => {
        this.gameState.keys[key] = true;
        this.handleKeyDown(key);
      });
      keyObj.on('up', () => {
        this.gameState.keys[key] = false;
      });
    });

    // Mouse input
    this.input.on('pointerdown', (pointer) => {
      this.gameState.mouseState.pressed = true;
      this.gameState.mouseState.x = pointer.x;
      this.gameState.mouseState.y = pointer.y;

      if (pointer.button === 0) {
        // Left click
        this.handleLeftClick(pointer.x, pointer.y);
      } else if (pointer.button === 2) {
        // Right click
        this.handleRightClick(pointer.x, pointer.y);
      }
    });

    this.input.on('pointerup', () => {
      this.gameState.mouseState.pressed = false;
    });

    this.input.on('pointermove', (pointer) => {
      this.gameState.mouseState.x = pointer.x;
      this.gameState.mouseState.y = pointer.y;
    });

    // Enable right-click context menu prevention
    this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleKeyDown(key) {
    if (key === 'KeyB') {
      this.gameState.buildMode = !this.gameState.buildMode;
      const indicator = document.getElementById('build-mode-indicator');
      if (indicator) {
        if (this.gameState.buildMode) {
          indicator.classList.add('active');
          showMessage('Build mode ON');
        } else {
          indicator.classList.remove('active');
          showMessage('Build mode OFF');
        }
      }
    } else if (key === 'KeyI' || key === 'Tab') {
      document.getElementById('inventory-modal').classList.add('active');
      populateInventoryModal(this.gameState.player.inventory);
    } else if (key === 'KeyC') {
      document.getElementById('crafting-modal').classList.add('active');
      populateCraftingModal(getRecipes(), this.gameState.player.inventory);
    } else if (key === 'KeyG') {
      document.getElementById('gauntlet-modal').classList.add('active');
      const owned = this.gauntletSystem.getOwnedStones(this.gameState.player);
      const equipped = this.gameState.player.gauntlet.filter((s) => s !== null);
      populateGauntletModal(owned, equipped);
    } else if (key === 'KeyM') {
      document.getElementById('map-modal').classList.add('active');
      this.renderMapCanvas();
    } else if (key === 'KeyL') {
      document.getElementById('ledger-modal').classList.add('active');
      updateLedgerModal(this.gameState);
    } else if (key === 'Escape') {
      document.getElementById('game-menu-modal').classList.add('active');
    } else if (key === 'Digit1') {
      this.gameState.selectedHotbarSlot = 0;
      this.updateHotbarUI();
    } else if (key === 'Digit2') {
      this.gameState.selectedHotbarSlot = 1;
      this.updateHotbarUI();
    } else if (key === 'Digit3') {
      this.gameState.selectedHotbarSlot = 2;
      this.updateHotbarUI();
    } else if (key === 'Digit4') {
      this.gameState.selectedHotbarSlot = 3;
      this.updateHotbarUI();
    } else if (key === 'Digit5') {
      this.gameState.selectedHotbarSlot = 4;
      this.updateHotbarUI();
    } else if (key === 'Digit6') {
      this.gameState.selectedHotbarSlot = 5;
      this.updateHotbarUI();
    } else if (key === 'Digit7') {
      this.gameState.selectedHotbarSlot = 6;
      this.updateHotbarUI();
    } else if (key === 'Digit8') {
      this.gameState.selectedHotbarSlot = 7;
      this.updateHotbarUI();
    } else if (key === 'Digit9') {
      this.gameState.selectedHotbarSlot = 8;
      this.updateHotbarUI();
    }
  }

  handleLeftClick(screenX, screenY) {
    // Convert screen coordinates to world coordinates.
    // Graphics use scrollFactor(0) so world = screen + cameraController offset.
    const worldX = screenX + this.cameraController.x;
    const worldY = screenY + this.cameraController.y;

    if (this.gameState.buildMode) {
      // Place block
      this.buildSystem.handleBuildClick(
        this.gameState.currentWorld,
        this.gameState.player,
        worldX,
        worldY,
        'left',
        this.gameState.selectedHotbarSlot,
        this.gameState.player.inventory
      );
    } else {
      // Attack echo
      if (this.gameState.echo && this.gameState.echo.hp > 0) {
        if (this.combatSystem.tryAttackEcho(this.gameState.player, this.gameState.echo)) {
          showMessage(`Hit! ${this.gameState.echo.hp.toFixed(0)} HP left`);
        }
      }
    }
  }

  handleRightClick(screenX, screenY) {
    // Convert screen coordinates to world coordinates.
    // Graphics use scrollFactor(0) so world = screen + cameraController offset.
    const worldX = screenX + this.cameraController.x;
    const worldY = screenY + this.cameraController.y;

    if (this.gameState.buildMode) {
      // Break block
      this.buildSystem.handleBuildClick(
        this.gameState.currentWorld,
        this.gameState.player,
        worldX,
        worldY,
        'right',
        this.gameState.selectedHotbarSlot,
        this.gameState.player.inventory
      );
    }
  }

  // ===== PORTAL SYSTEM =====

  checkPortalInteraction() {
    const player = this.gameState.player;
    const tiles = this.gameState.currentWorld.tiles;

    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);

    // Check nearby tiles for portals
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tileX = playerTileX + dx;
        const tileY = playerTileY + dy;

        if (
          tileX >= 0 &&
          tileX < tiles[0].length &&
          tileY >= 0 &&
          tileY < tiles.length &&
          tiles[tileY][tileX] === TILES.PORTAL
        ) {
          // Found a portal! Pick a random new branch
          const randomBranch = BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
          this.portalTransition.start(randomBranch);
          return;
        }
      }
    }
  }

  handlePortalTransition() {
    const phase = this.portalTransition.getPhase();
    const progress = this.portalTransition.getProgress();

    if (phase === 'zoomOut') {
      // Zoom out
      const zoom = 1 - progress * 0.5;
      this.cameraController.zoom = zoom;
    } else if (phase === 'sliceView') {
      // Middle phase - dim screen and show branch name
      this.cameraController.zoom = 0.5;
    } else if (phase === 'zoomIn') {
      // Zoom in to new world
      const zoom = 0.5 + progress * 0.5;
      this.cameraController.zoom = zoom;

      // Switch branch when we reach the middle of zoomIn
      if (progress > 0.1 && !this.portalTransition._switched) {
        this.portalTransition._switched = true;

        // Generate new world if needed
        const targetBranch = this.portalTransition.getTargetBranch();
        this.generateWorld(targetBranch.id);

        // Spawn new echo
        this.gameState.echo = this.echoAI.spawnEcho(
          this.gameState.currentWorld,
          this.gameState.echoesAbsorbed,
          targetBranch
        );

        // Teleport player (preserve position)
        // Reset visibility and attack state
        this.gameState.player.invisible = false;
        this.gameState.player.invisibleTimer = 0;

        // Record world exploration
        if (!this.gameState.worlds[targetBranch.id]) {
          this.gameState.worldsExplored++;
        }

        showMessage(`Entered ${targetBranch.name}!`);
      }
    }
  }

  // ===== ECHO SYSTEM =====

  handleEchoDefeat() {
    this.gameState.echoesAbsorbed++;

    // Award random stone (every 3 echoes)
    if (this.gameState.echoesAbsorbed % 3 === 0) {
      const randomStone = POWER_STONES[Math.floor(Math.random() * POWER_STONES.length)];
      this.gauntletSystem.awardStone(this.gameState.player, randomStone.id);
      showMessage(`Earned: ${randomStone.name}!`);
    }

    // Spawn new echo
    setTimeout(() => {
      this.gameState.echo = this.echoAI.spawnEcho(
        this.gameState.currentWorld,
        this.gameState.echoesAbsorbed,
        this.gameState.currentBranch
      );
    }, 500);
  }

  // ===== PICKUP ITEMS =====

  updatePickupItems(dt) {
    const pickupItems = this.gameState.pickupItems;

    for (let i = pickupItems.length - 1; i >= 0; i--) {
      const item = pickupItems[i];

      // Apply gravity
      item.vy += 0.3;

      // Update position
      item.x += item.vx;
      item.y += item.vy;

      // Collision with ground (simple)
      const tileY = Math.floor(item.y / TILE_SIZE);
      if (tileY >= 0 && tileY < this.gameState.currentWorld.tiles.length) {
        const tileBelow = this.gameState.currentWorld.tiles[tileY + 1];
        if (tileBelow && tileBelow[Math.floor(item.x / TILE_SIZE)] !== TILES.AIR) {
          item.vy = 0;
          item.y = tileY * TILE_SIZE;
        }
      }

      // Check if player touches
      const dx = item.x - this.gameState.player.x;
      const dy = item.y - this.gameState.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        // Pick up
        addItem(this.gameState.player.inventory, item.itemId, 1);
        pickupItems.splice(i, 1);
      }
    }
  }

  // ===== RENDERING =====

  renderWorld() {
    const g = this.graphics;
    g.clear();

    // Reset text pool each frame — hide all, then hand out as needed
    this._textPoolUsed = 0;
    this._textPool.forEach((t) => t.setVisible(false));

    const world = this.gameState.currentWorld;
    const branch = this.gameState.currentBranch;
    const player = this.gameState.player;
    const echo = this.gameState.echo;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const camX = this.cameraController.x;
    const camY = this.cameraController.y;
    const zoom = this.cameraController.zoom;

    // ===== SKY GRADIENT =====
    g.fillStyle(0x0a0a2e);
    g.fillRect(0, 0, width, height);

    // Sky gradient (5 horizontal bands)
    for (let i = 0; i < 5; i++) {
      const y = (i * height) / 5;
      const t = i / 5;
      g.fillStyle(Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.HexStringToColor(branch.skyTop),
        Phaser.Display.Color.HexStringToColor(branch.skyBottom),
        1,
        t
      ).color);
      g.fillRect(0, y, width, height / 5);
    }

    // ===== STARS =====
    if (world.stars) {
      const starColor = Phaser.Display.Color.HexStringToColor(branch.starColor || '#c8c8ff').color;
      g.fillStyle(starColor);

      world.stars.forEach((star) => {
        const screenX = star.x - camX;
        const screenY = star.y - camY;

        if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
          const radius = star.brightness * 1.5;
          g.fillCircle(screenX, screenY, radius);
        }
      });
    }

    // ===== PARALLAX MOUNTAINS =====
    this.renderMountains(g, branch, camX, camY, width, height, zoom);

    // ===== TILES =====
    this.renderTiles(g, world, branch, camX, camY, width, height, zoom);

    // ===== CHARACTERS =====
    this.renderPlayer(g, player, camX, camY);
    if (echo && echo.hp > 0) {
      this.renderEcho(g, echo, camX, camY);
    }

    // ===== PICKUP ITEMS =====
    this.renderPickupItems(g, camX, camY);

    // ===== MINING PROGRESS BAR =====
    if (this.miningSystem.currentTarget && this.miningSystem.targetProgress > 0) {
      const targetKey = this.miningSystem.currentTarget;
      const [tileX, tileY] = targetKey.split(',').map(Number);
      const barX = tileX * TILE_SIZE - camX;
      const barY = tileY * TILE_SIZE - camY - 10;

      if (barX > 0 && barX < width && barY > 0 && barY < height) {
        g.fillStyle(0xff8800);
        g.fillRect(barX, barY, TILE_SIZE * this.miningSystem.targetProgress, 3);
        g.lineStyle(1, 0xffaa44);
        g.strokeRect(barX, barY, TILE_SIZE, 3);
      }
    }

    // ===== PORTAL LABELS =====
    this.renderPortalLabels(g, world, camX, camY, width, height);

    // ===== PORTAL TRANSITION OVERLAY =====
    if (this.portalTransition.isActive()) {
      this.renderPortalTransitionOverlay(g, camX, camY, width, height);
    }
  }

  renderMountains(g, branch, camX, camY, width, height, zoom) {
    const mountainColor1 = branch.mountainColor1 || '#1e1e3c';
    const mountainColor2 = branch.mountainColor2 || '#14142d';

    const parallaxOffset1 = (camX * 0.3) % (WORLD_WIDTH * TILE_SIZE);
    const parallaxOffset2 = (camX * 0.5) % (WORLD_WIDTH * TILE_SIZE);

    // FIX: fillTriangleShape does not exist in Phaser 3. Use fillTriangle(x1,y1,x2,y2,x3,y3).
    g.fillStyle(Phaser.Display.Color.HexStringToColor(mountainColor1).color);
    g.fillTriangle(
      -parallaxOffset1,          height / 3,
      -parallaxOffset1 + 300,    height / 2,
      -parallaxOffset1 - 300,    height / 2
    );

    g.fillStyle(Phaser.Display.Color.HexStringToColor(mountainColor2).color);
    g.fillTriangle(
      200 - parallaxOffset2,         height / 2.5,
      200 - parallaxOffset2 + 350,   height / 1.8,
      200 - parallaxOffset2 - 350,   height / 1.8
    );
  }

  renderTiles(g, world, branch, camX, camY, width, height, zoom) {
    const tiles = world.tiles;

    const startTileX = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endTileX = Math.min(tiles[0].length, Math.ceil((camX + width) / TILE_SIZE) + 1);
    const startTileY = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endTileY = Math.min(tiles.length, Math.ceil((camY + height) / TILE_SIZE) + 1);

    // Render tiles
    for (let y = startTileY; y < endTileY; y++) {
      for (let x = startTileX; x < endTileX; x++) {
        const tileId = tiles[y][x];

        if (tileId === TILES.AIR) continue;

        const screenX = x * TILE_SIZE - camX;
        const screenY = y * TILE_SIZE - camY;

        const colors = TILE_COLORS[tileId] || ['#444444'];
        // Use a stable hash from tile coordinates so color doesn't flicker each frame
        const colorIdx = ((x * 2654435761) ^ (y * 2246822519)) % colors.length;
        const color = colors[Math.abs(colorIdx)];

        if (tileId === TILES.PORTAL) {
          // Pulsing portal
          const pulse = (Math.sin(Date.now() / 500) + 1) / 2;
          // FIX: g.globalAlpha does not exist in Phaser 3 — use g.setAlpha()
          g.setAlpha(0.5 + pulse * 0.5);
          g.fillStyle(Phaser.Display.Color.HexStringToColor(color).color);
          g.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          g.setAlpha(1);

          // Portal glow
          g.lineStyle(2, 0x4488ff, 1);
          g.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        } else if (tileId === TILES.PLANT) {
          // Plant tile — draw colored rect; use text pool for the emoji overlay
          // FIX: removed g.save()/g.restore() (don't exist) and g.fillText() (doesn't exist).
          g.fillStyle(Phaser.Display.Color.HexStringToColor(color).color);
          g.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          // Emoji label via text pool (origin at top-left of tile)
          this._getPoolText(screenX + 2, screenY, '🌿', '#ffffff', '12px');
        } else if (tileId === TILES.LEAF) {
          // Leaf
          g.fillStyle(Phaser.Display.Color.HexStringToColor(color).color);
          g.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        } else {
          // Regular tile
          g.fillStyle(Phaser.Display.Color.HexStringToColor(color).color);
          g.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          g.lineStyle(0.5, 0x222222);
          g.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Render build cursor if in build mode
    if (this.gameState.buildMode) {
      // FIX: don't use getWorldPoint — compute directly from cameraController offsets.
      // Graphics are in screen-space (scrollFactor 0), so world = screen + camOffset.
      const mouseWorldX = this.gameState.mouseState.x + camX;
      const mouseWorldY = this.gameState.mouseState.y + camY;
      const tileX = Math.floor(mouseWorldX / TILE_SIZE);
      const tileY = Math.floor(mouseWorldY / TILE_SIZE);

      if (tileX >= startTileX && tileX < endTileX && tileY >= startTileY && tileY < endTileY) {
        const screenX = tileX * TILE_SIZE - camX;
        const screenY = tileY * TILE_SIZE - camY;

        g.lineStyle(2, 0xffaa44, 1);
        g.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  renderPlayer(g, player, camX, camY) {
    const x = player.x - camX;
    const y = player.y - camY;

    const visualX = x + player.visualXOffset;
    const visualY = y + player.visualYOffset;

    // Draw simple character
    g.fillStyle(0xffddaa);
    g.fillRect(visualX, visualY, player.w, 8); // Head

    g.fillStyle(0xffccaa);
    g.fillRect(visualX, visualY + 8, player.w, 12); // Body

    g.fillStyle(0xffbbaa);
    g.fillRect(visualX, visualY + 20, 4, 8); // Left leg
    g.fillRect(visualX + 12, visualY + 20, 4, 8); // Right leg

    // Facing direction (simple eyes)
    const eyeDir = player.facing > 0 ? 2 : -2;
    g.fillStyle(0x000000);
    g.fillCircle(visualX + 6 + eyeDir, visualY + 2, 1.5);

    // Invisibility effect
    if (player.invisible) {
      g.lineStyle(2, 0x6688cc);
      g.strokeRect(visualX - 2, visualY - 2, player.w + 4, player.h + 4);
    }
  }

  renderEcho(g, echo, camX, camY) {
    const x = echo.x - camX;
    const y = echo.y - camY;

    // Draw echo (darker version of player)
    g.fillStyle(0x8844aa);
    g.fillRect(x, y, echo.w, 7); // Head

    g.fillStyle(0x6633aa);
    g.fillRect(x, y + 7, echo.w, 10); // Body

    g.fillStyle(0x5522aa);
    g.fillRect(x, y + 17, 3, 7); // Left leg
    g.fillRect(x + 13, y + 17, 3, 7); // Right leg

    // Eyes
    const eyeDir = echo.facing > 0 ? 2 : -2;
    g.fillStyle(0xffff00);
    g.fillCircle(x + 5 + eyeDir, y + 1.5, 1);

    // HP bar above echo
    const hpPercent = echo.hp / echo.maxHp;
    g.fillStyle(0x444444);
    g.fillRect(x, y - 8, echo.w, 4);
    g.fillStyle(0xff4444);
    g.fillRect(x, y - 8, echo.w * hpPercent, 4);
    g.lineStyle(1, 0xffaaaa);
    g.strokeRect(x, y - 8, echo.w, 4);
  }

  renderPickupItems(g, camX, camY) {
    this.gameState.pickupItems.forEach((item) => {
      const x = item.x - camX;
      const y = item.y - camY - Math.sin(Date.now() / 500 + item.bobPhase) * 3;

      // FIX: g.fillText does not exist — use text pool instead
      const icon = ITEM_ICONS[item.itemId] || '?';
      this._getPoolText(x, y, icon, '#ffffff', '14px');
    });
  }

  renderPortalLabels(g, world, camX, camY, width, height) {
    const tiles = world.tiles;

    const startTileX = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endTileX = Math.min(tiles[0].length, Math.ceil((camX + width) / TILE_SIZE) + 1);
    const startTileY = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endTileY = Math.min(tiles.length, Math.ceil((camY + height) / TILE_SIZE) + 1);

    for (let y = startTileY; y < endTileY; y++) {
      for (let x = startTileX; x < endTileX; x++) {
        if (tiles[y][x] === TILES.PORTAL) {
          const screenX = x * TILE_SIZE - camX + TILE_SIZE / 2;
          const screenY = y * TILE_SIZE - camY - 15;

          // FIX: g.fillText does not exist — use text pool instead
          this._getPoolText(screenX - 30, screenY, 'E to travel', '#4488ff', '11px');
        }
      }
    }
  }

  renderPortalTransitionOverlay(g, camX, camY, width, height) {
    const phase = this.portalTransition.getPhase();
    const progress = this.portalTransition.getProgress();

    if (phase === 'sliceView') {
      // Dark overlay
      // FIX: g.globalAlpha does not exist — use g.setAlpha()
      g.setAlpha(0.7);
      g.fillStyle(0x000000);
      g.fillRect(0, 0, width, height);
      g.setAlpha(1);

      // Show branch name — FIX: g.fillText does not exist — use text pool
      const branch = this.portalTransition.getTargetBranch();
      if (branch) {
        this._getPoolText(width / 2 - 60, height / 2, branch.name, '#aa88ff', '20px');
      }
    }
  }

  // ===== MODAL SYSTEM =====

  setupModalListeners() {
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Version badge click
    const versionBadge = document.getElementById('version-badge');
    if (versionBadge) {
      versionBadge.addEventListener('click', () => {
        document.getElementById('changelog-modal').classList.add('active');
      });
    }

    // Gauntlet slot clicks
    document.querySelectorAll('.stone-slot').forEach((slot) => {
      slot.addEventListener('click', () => {
        document.getElementById('gauntlet-modal').classList.add('active');
        const owned = this.gauntletSystem.getOwnedStones(this.gameState.player);
        const equipped = this.gameState.player.gauntlet.filter((s) => s !== null);
        populateGauntletModal(owned, equipped);
      });
    });

    // Hotbar slot clicks
    document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
      slot.addEventListener('click', () => {
        this.gameState.selectedHotbarSlot = index;
        this.updateHotbarUI();
      });
    });

    // Override window functions for crafting and gauntlet
    window.craftItem = (recipeId) => {
      const recipe = getRecipeById(recipeId);
      if (recipe) {
        const itemId = craftItem(recipe, this.gameState.player.inventory);
        if (itemId) {
          showMessage(`Crafted: ${recipe.name}!`);
          populateCraftingModal(getRecipes(), this.gameState.player.inventory);
        }
      }
    };

    window.toggleStoneEquip = (stoneId) => {
      const currentSlot = this.gameState.player.gauntlet.indexOf(stoneId);

      if (currentSlot !== -1) {
        // Unequip
        this.gauntletSystem.unequipStone(this.gameState.player, currentSlot);
      } else {
        // Equip to first empty slot
        const emptySlot = this.gameState.player.gauntlet.indexOf(null);
        if (emptySlot !== -1) {
          this.gauntletSystem.equipStone(this.gameState.player, stoneId, emptySlot);
        }
      }

      const owned = this.gauntletSystem.getOwnedStones(this.gameState.player);
      const equipped = this.gameState.player.gauntlet.filter((s) => s !== null);
      populateGauntletModal(owned, equipped);
      updateGauntletUI(this.gameState);
    };

    // Battle UI action handler
    window.executeBattleAction = (action) => {
      if (!this.gameState.turnBattle || !this.gameState.turnBattle.isActive) return;

      this.gameState.turnBattle = this.combatSystem.executeTurnAction(
        action,
        this.gameState.turnBattle,
        this.gameState.player
      );

      // Update player actual HP if battle is still active
      if (this.gameState.turnBattle.isActive) {
        this.gameState.player.hp = this.gameState.turnBattle.player.hp;
      } else {
        // Battle ended
        this.gameState.player.hp = this.gameState.turnBattle.player.hp;

        if (this.gameState.turnBattle.player.hp <= 0) {
          showMessage('You were defeated! Respawning...');
          setTimeout(() => {
            this.gameState.player.x = 100;
            this.gameState.player.y = 50;
            this.gameState.player.hp = this.gameState.player.maxHp;
          }, 1500);
        } else if (this.gameState.turnBattle.echo && this.gameState.turnBattle.echo.hp <= 0) {
          showMessage('Victory!');
          this.handleEchoDefeat();
          if (this.gameState.echo) {
            this.gameState.echo.hp = 0; // Mark echo as dead
          }
        }

        this.gameState.turnBattle = null;
      }

      updateBattleUI(this.gameState.turnBattle, this.gameState.player, this.gameState.echo);
    };
  }

  updateHotbarUI() {
    document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
      if (index === this.gameState.selectedHotbarSlot) {
        slot.classList.add('active');
      } else {
        slot.classList.remove('active');
      }
    });
  }

  // ===== MAP RENDERING =====

  renderMapCanvas() {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const branches = BRANCHES;

    // Simple branch map visualization
    canvas.width = 400;
    canvas.height = 400;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw branches as circles
    const positions = [
      { x: 200, y: 100 }, // Origin
      { x: 100, y: 200 }, // Wild1
      { x: 300, y: 200 }, // Wild2
      { x: 200, y: 300 }, // Wild3
    ];

    branches.forEach((branch, index) => {
      const pos = positions[index];
      if (!pos) return;
      const isCurrent = branch.id === this.gameState.currentBranch.id;

      // Draw circle
      ctx.fillStyle = isCurrent ? '#ffaa44' : '#6688cc';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = isCurrent ? '#ffaa44' : '#6688cc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#e0e0ff';
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(branch.name, pos.x, pos.y + 50);
    });

    // Draw connections
    ctx.strokeStyle = '#445566';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}
