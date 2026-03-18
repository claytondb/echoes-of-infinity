/**
 * GauntletSystem.js - Power stone (gauntlet slot) management
 */

import { POWER_STONES } from '../data/StoneData.js';

export class GauntletSystem {
  /**
   * Award a stone to the player
   * @param {object} player - Player entity
   * @param {string} stoneId - Stone ID
   * @returns {boolean} True if awarded
   */
  awardStone(player, stoneId) {
    const stone = POWER_STONES.find((s) => s.id === stoneId);
    if (!stone) {
      return false;
    }

    if (!player.ownedStones.includes(stoneId)) {
      player.ownedStones.push(stoneId);
      return true;
    }

    return false;
  }

  /**
   * Equip a stone in a gauntlet slot
   * @param {object} player - Player entity
   * @param {string} stoneId - Stone ID
   * @param {number} slot - Slot 0-4
   * @returns {boolean} True if equipped
   */
  equipStone(player, stoneId, slot) {
    if (!player.ownedStones.includes(stoneId)) {
      return false;
    }

    if (slot < 0 || slot >= player.gauntlet.length) {
      return false;
    }

    player.gauntlet[slot] = stoneId;
    return true;
  }

  /**
   * Unequip stone from slot
   * @param {object} player - Player entity
   * @param {number} slot - Slot 0-4
   * @returns {boolean} True if unequipped
   */
  unequipStone(player, slot) {
    if (slot < 0 || slot >= player.gauntlet.length) {
      return false;
    }

    player.gauntlet[slot] = null;
    return true;
  }

  /**
   * Check if stone is equipped
   * @param {object} player - Player entity
   * @param {string} stoneId - Stone ID
   * @returns {boolean}
   */
  isStoneEquipped(player, stoneId) {
    return player.gauntlet.includes(stoneId);
  }

  /**
   * Get all equipped stones
   * @param {object} player - Player entity
   * @returns {array} Array of equipped stone objects
   */
  getEquippedStones(player) {
    return player.gauntlet
      .filter((stoneId) => stoneId !== null)
      .map((stoneId) => POWER_STONES.find((s) => s.id === stoneId))
      .filter((stone) => stone !== undefined);
  }

  /**
   * Get all owned stones
   * @param {object} player - Player entity
   * @returns {array} Array of owned stone objects
   */
  getOwnedStones(player) {
    return player.ownedStones
      .map((stoneId) => POWER_STONES.find((s) => s.id === stoneId))
      .filter((stone) => stone !== undefined);
  }
}
