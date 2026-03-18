/**
 * HUD.js - HUD update functions
 */

import { ITEM_ICONS, ITEM_NAMES } from '../data/Recipes.js';
import { POWER_STONES } from '../data/StoneData.js';

/**
 * Update HUD elements with game state
 */
export function updateHUD(gameState) {
  if (!gameState.player || !gameState.currentBranch) {
    return;
  }

  const player = gameState.player;
  const branch = gameState.currentBranch;

  // Version
  document.getElementById('hud-version').textContent = gameState.gameVersion || '0.7.0';

  // Branch name
  document.getElementById('hud-branch').textContent = branch.name || 'Unknown';

  // HP bar
  const hpPercent = (player.hp / player.maxHp) * 100;
  document.getElementById('hud-hp').textContent = `${Math.max(0, Math.round(player.hp))}/${player.maxHp}`;
  document.getElementById('hud-hp-fill').style.width = `${hpPercent}%`;

  // Stamina bar
  const staminaPercent = (player.stamina / player.maxStamina) * 100;
  document.getElementById('hud-stamina').textContent = `${Math.max(0, Math.round(player.stamina))}/${player.maxStamina}`;
  document.getElementById('hud-stamina-fill').style.width = `${staminaPercent}%`;

  // Resonance (echoes absorbed)
  const echoesAbsorbed = gameState.echoesAbsorbed || 0;
  document.getElementById('hud-resonance').textContent = echoesAbsorbed;
  const resonancePercent = Math.min((echoesAbsorbed / 10) * 100, 100); // Max at 10 echoes
  document.getElementById('hud-resonance-fill').style.width = `${resonancePercent}%`;

  // Update hotbar
  updateHotbar(player.inventory);
}

/**
 * Update gauntlet UI with equipped stones
 */
export function updateGauntletUI(gameState) {
  if (!gameState.player) return;

  const player = gameState.player;
  const slots = document.querySelectorAll('.stone-slot');

  slots.forEach((slot, index) => {
    const stoneId = player.gauntlet[index];
    if (stoneId) {
      const stone = POWER_STONES.find((s) => s.id === stoneId);
      if (stone) {
        slot.textContent = stone.emoji;
        slot.classList.remove('empty');
        slot.title = stone.name;
      }
    } else {
      slot.textContent = '⚪';
      slot.classList.add('empty');
      slot.title = 'Empty slot';
    }
  });
}

/**
 * Update hotbar display
 */
function updateHotbar(inventory) {
  const hotbarSlots = document.querySelectorAll('.hotbar-slot');
  const itemIds = Object.keys(inventory)
    .map(Number)
    .filter((id) => id > 0 && inventory[id] > 0)
    .sort((a, b) => a - b);

  hotbarSlots.forEach((slot, index) => {
    if (index < itemIds.length) {
      const itemId = itemIds[index];
      const count = inventory[itemId];
      const icon = ITEM_ICONS[itemId] || '?';
      const name = ITEM_NAMES[itemId] || 'Unknown';

      const iconEl = slot.querySelector('.hotbar-icon');
      const countEl = slot.querySelector('.hotbar-count');

      iconEl.textContent = icon;
      countEl.textContent = count > 1 ? count : '';
      slot.title = `${name} (x${count})`;
    } else {
      const iconEl = slot.querySelector('.hotbar-icon');
      const countEl = slot.querySelector('.hotbar-count');
      iconEl.textContent = '-';
      countEl.textContent = '';
      slot.title = 'Empty';
    }
  });
}

/**
 * Show a centered message that fades out
 */
export function showMessage(text, durationMs = 3000) {
  const messageArea = document.getElementById('message-area');
  const message = document.createElement('div');
  message.className = 'message';
  message.textContent = text;

  messageArea.innerHTML = '';
  messageArea.appendChild(message);

  setTimeout(() => {
    if (message.parentElement === messageArea) {
      messageArea.removeChild(message);
    }
  }, durationMs);
}

/**
 * Update turn battle UI
 */
export function updateBattleUI(turnBattle, player, echo) {
  if (!turnBattle || !turnBattle.isActive) {
    document.getElementById('turn-battle-ui').classList.remove('active');
    return;
  }

  document.getElementById('turn-battle-ui').classList.add('active');

  // Update player HP bar
  const playerHpPercent = (turnBattle.player.hp / turnBattle.player.maxHp) * 100;
  document.getElementById('battle-player-hp-fill').style.width = `${playerHpPercent}%`;
  document.getElementById('battle-player-hp').textContent = `${Math.max(0, Math.round(turnBattle.player.hp))}/${turnBattle.player.maxHp}`;

  // Update echo HP bar
  const echoHpPercent = (turnBattle.echo.hp / turnBattle.echo.maxHp) * 100;
  document.getElementById('battle-echo-hp-fill').style.width = `${echoHpPercent}%`;
  document.getElementById('battle-echo-hp').textContent = `${Math.max(0, Math.round(turnBattle.echo.hp))}/${turnBattle.echo.maxHp}`;

  // Update echo name
  if (echo) {
    document.getElementById('battle-echo-name').textContent = `Echo v${echo.version}.${echo.minor}`;
  }

  // Update battle log (show last 5 entries)
  const logEl = document.getElementById('battle-log');
  const recentLogs = turnBattle.turnLog.slice(-5);
  logEl.innerHTML = recentLogs
    .map((entry) => `<div class="battle-log-entry">${entry}</div>`)
    .join('');
  logEl.scrollTop = logEl.scrollHeight;
}

/**
 * Populate inventory modal
 */
export function populateInventoryModal(inventory) {
  const inventoryGrid = document.getElementById('inventory-grid');
  inventoryGrid.innerHTML = '';

  const itemIds = Object.keys(inventory)
    .map(Number)
    .filter((id) => inventory[id] > 0)
    .sort((a, b) => a - b);

  if (itemIds.length === 0) {
    inventoryGrid.innerHTML = '<p style="color: #8899bb; grid-column: 1 / -1;">Inventory is empty</p>';
    return;
  }

  itemIds.forEach((itemId) => {
    const count = inventory[itemId];
    const icon = ITEM_ICONS[itemId] || '?';
    const name = ITEM_NAMES[itemId] || 'Unknown';

    const itemEl = document.createElement('div');
    itemEl.className = 'inventory-item';
    itemEl.innerHTML = `
      <div class="inventory-icon">${icon}</div>
      <div class="inventory-name">${name}</div>
      <div class="inventory-count">x${count}</div>
    `;
    inventoryGrid.appendChild(itemEl);
  });
}

/**
 * Populate crafting modal
 */
export function populateCraftingModal(recipes, inventory) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';

  recipes.forEach((recipe) => {
    const canCraft = canCraftRecipe(recipe, inventory);

    const costText = recipe.cost
      .map(([itemId, count]) => {
        const have = inventory[itemId] || 0;
        return `${ITEM_NAMES[itemId]} x${count} (${have}/${count})`;
      })
      .join(', ');

    const recipeEl = document.createElement('div');
    recipeEl.className = `recipe-item ${!canCraft ? 'disabled' : ''}`;
    recipeEl.innerHTML = `
      <div class="recipe-left">
        <div class="recipe-icon">${recipe.icon}</div>
        <div class="recipe-info">
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-cost">${costText}</div>
        </div>
      </div>
      <button class="recipe-button" ${!canCraft ? 'disabled' : ''} onclick="window.craftItem(${recipe.id})">Craft</button>
    `;
    recipeList.appendChild(recipeEl);
  });
}

/**
 * Helper function to check if recipe can be crafted
 */
function canCraftRecipe(recipe, inventory) {
  return recipe.cost.every(([itemId, count]) => (inventory[itemId] || 0) >= count);
}

/**
 * Populate gauntlet equip modal
 */
export function populateGauntletModal(ownedStones, equippedStones) {
  const stoneGrid = document.getElementById('stone-grid');
  stoneGrid.innerHTML = '';

  ownedStones.forEach((stone) => {
    const isEquipped = equippedStones.includes(stone.id);
    const stoneEl = document.createElement('div');
    stoneEl.className = `stone-card ${isEquipped ? 'equipped' : ''}`;
    stoneEl.innerHTML = `
      <div class="stone-emoji">${stone.emoji}</div>
      <div class="stone-name">${stone.name}</div>
      <div class="stone-description">${stone.description}</div>
    `;
    stoneEl.onclick = () => {
      window.toggleStoneEquip(stone.id);
    };
    stoneGrid.appendChild(stoneEl);
  });

  if (ownedStones.length === 0) {
    stoneGrid.innerHTML = '<p style="color: #8899bb; grid-column: 1 / -1;">No stones owned yet. Defeat echoes to earn them!</p>';
  }
}

/**
 * Update ledger modal
 */
export function updateLedgerModal(gameState) {
  const echoesAbsorbed = gameState.echoesAbsorbed || 0;
  const worldsExplored = gameState.worldsExplored || 1;
  const stonesOwned = gameState.player.ownedStones.length || 0;
  const distanceTraveled = Math.round((gameState.totalDistance || 0) / 24); // Convert pixels to tiles

  document.getElementById('ledger-echoes').textContent = echoesAbsorbed;
  document.getElementById('ledger-worlds').textContent = worldsExplored;
  document.getElementById('ledger-stones').textContent = stonesOwned;
  document.getElementById('ledger-distance').textContent = `${distanceTraveled} tiles`;
}
