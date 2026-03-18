/**
 * InventorySystem.js - Player inventory management
 */

/**
 * Add items to inventory
 * @param {object} inventory - Inventory object
 * @param {number} itemId - Item ID
 * @param {number} count - Number of items to add
 */
export function addItem(inventory, itemId, count) {
  if (!inventory[itemId]) {
    inventory[itemId] = 0;
  }
  inventory[itemId] += count;
}

/**
 * Remove items from inventory
 * @param {object} inventory - Inventory object
 * @param {number} itemId - Item ID
 * @param {number} count - Number of items to remove
 * @returns {boolean} True if successful, false if not enough items
 */
export function removeItem(inventory, itemId, count) {
  const currentCount = inventory[itemId] || 0;
  if (currentCount < count) {
    return false;
  }

  inventory[itemId] -= count;
  if (inventory[itemId] <= 0) {
    delete inventory[itemId];
  }

  return true;
}

/**
 * Get item ID from hotbar slot
 * @param {object} inventory - Inventory object
 * @param {number} slot - Hotbar slot (0-8)
 * @returns {number|null} Item ID or null
 */
export function getHotbarItemId(inventory, slot) {
  const itemIds = Object.keys(inventory)
    .map(Number)
    .filter((id) => id > 0);
  if (slot >= 0 && slot < itemIds.length) {
    return itemIds[slot];
  }
  return null;
}

/**
 * Check if inventory has item
 * @param {object} inventory - Inventory object
 * @param {number} itemId - Item ID
 * @param {number} count - Required count
 * @returns {boolean}
 */
export function hasItem(inventory, itemId, count) {
  return (inventory[itemId] || 0) >= count;
}

/**
 * Get item count
 * @param {object} inventory - Inventory object
 * @param {number} itemId - Item ID
 * @returns {number}
 */
export function getItemCount(inventory, itemId) {
  return inventory[itemId] || 0;
}

/**
 * Clear inventory
 * @param {object} inventory - Inventory object
 */
export function clearInventory(inventory) {
  for (const key in inventory) {
    delete inventory[key];
  }
}
