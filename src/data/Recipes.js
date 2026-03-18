/**
 * Recipes.js - Crafting recipes and item definitions
 */

import { TILES } from './TileTypes.js';

export const RECIPES = [
  {
    id: 101,
    name: 'Wooden Stick',
    icon: '🪵',
    cost: [[TILES.WOOD, 5]],
    toolDurability: 100,
  },
  {
    id: 102,
    name: 'Torch',
    icon: '🔦',
    cost: [[TILES.WOOD, 1], [TILES.STONE, 1]],
  },
  {
    id: 103,
    name: 'Workbench',
    icon: '🛠️',
    cost: [[TILES.WOOD, 10], [TILES.STONE, 5]],
    placeable: true,
  },
  {
    id: 104,
    name: 'Stone Pickaxe',
    icon: '⛏️',
    cost: [[TILES.STONE, 5], [TILES.WOOD, 3]],
    toolDurability: 150,
    miningMultiplier: 1.5,
  },
  {
    id: 105,
    name: 'Wooden Armor',
    icon: '🛡️',
    cost: [[TILES.WOOD, 15]],
    defense: 10,
  },
  {
    id: 106,
    name: 'Stone Sword',
    icon: '⚔️',
    cost: [[TILES.STONE, 8], [TILES.WOOD, 2]],
    attackBonus: 5,
    toolDurability: 120,
  },
  {
    id: 107,
    name: 'Portal Frame',
    icon: '🌀',
    cost: [[TILES.CRYSTAL, 10], [TILES.STONE, 5]],
    placeable: true,
  },
];

/**
 * Build ITEM_NAMES map from tile types and recipes
 */
export const ITEM_NAMES = {
  [TILES.AIR]: 'Air',
  [TILES.DIRT]: 'Dirt',
  [TILES.STONE]: 'Stone',
  [TILES.GRASS]: 'Grass',
  [TILES.PLANT]: 'Plant',
  [TILES.CRYSTAL]: 'Crystal',
  [TILES.PORTAL]: 'Portal',
  [TILES.WOOD]: 'Wood',
  [TILES.LEAF]: 'Leaf',
};

/**
 * Build ITEM_ICONS map from tile types and recipes
 */
export const ITEM_ICONS = {
  [TILES.AIR]: '空',
  [TILES.DIRT]: '🟫',
  [TILES.STONE]: '🪨',
  [TILES.GRASS]: '🌱',
  [TILES.PLANT]: '🌿',
  [TILES.CRYSTAL]: '💜',
  [TILES.PORTAL]: '🌀',
  [TILES.WOOD]: '🪵',
  [TILES.LEAF]: '🍃',
};

// Add crafted items to maps
RECIPES.forEach((recipe) => {
  ITEM_NAMES[recipe.id] = recipe.name;
  ITEM_ICONS[recipe.id] = recipe.icon;
});
