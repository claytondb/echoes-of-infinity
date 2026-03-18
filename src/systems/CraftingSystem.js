/**
 * CraftingSystem.js - Crafting recipes and item creation
 */

import { RECIPES } from '../data/Recipes.js';

/**
 * Check if player can craft a recipe
 * @param {object} recipe - Recipe object
 * @param {object} inventory - Player inventory
 * @returns {boolean}
 */
export function canCraft(recipe, inventory) {
  if (!recipe || !recipe.cost) {
    return false;
  }

  for (const [itemId, requiredCount] of recipe.cost) {
    const playerCount = inventory[itemId] || 0;
    if (playerCount < requiredCount) {
      return false;
    }
  }

  return true;
}

/**
 * Craft an item
 * @param {object} recipe - Recipe object
 * @param {object} inventory - Player inventory (modified in-place)
 * @returns {number|null} Crafted item ID or null if failed
 */
export function craft(recipe, inventory) {
  if (!canCraft(recipe, inventory)) {
    return null;
  }

  // Deduct materials
  for (const [itemId, requiredCount] of recipe.cost) {
    inventory[itemId] -= requiredCount;
    if (inventory[itemId] <= 0) {
      delete inventory[itemId];
    }
  }

  // Add crafted item
  if (!inventory[recipe.id]) {
    inventory[recipe.id] = 0;
  }
  inventory[recipe.id] += 1;

  return recipe.id;
}

/**
 * Get all recipes
 */
export function getRecipes() {
  return RECIPES;
}

/**
 * Get recipe by ID
 */
export function getRecipeById(id) {
  return RECIPES.find((r) => r.id === id) || null;
}
