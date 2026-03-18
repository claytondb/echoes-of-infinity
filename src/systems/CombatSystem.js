/**
 * CombatSystem.js - Combat and turn-based battle handling
 */

import { POWER_STONES } from '../data/StoneData.js';

export class CombatSystem {
  /**
   * Check if player can attack echo
   * @param {object} player - Player entity
   * @param {object} echo - Echo entity
   * @returns {boolean} True if attack occurred
   */
  tryAttackEcho(player, echo) {
    if (!echo || echo.hp <= 0 || player.attackTimer > 0) {
      return false;
    }

    const dx = echo.x - player.x;
    const dy = echo.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 40) {
      return false;
    }

    // Face echo
    player.facing = dx > 0 ? 1 : -1;

    // Deal damage
    const baseDamage = player.power;
    const toolBonus = 0; // Can add tool bonuses here if needed
    const totalDamage = baseDamage + toolBonus;

    echo.hp -= totalDamage;
    player.attackTimer = player.attackCooldown;

    // Knockback
    const knockbackDir = dx > 0 ? 1 : -1;
    echo.vx = knockbackDir * 4;
    echo.vy = -5;

    return true;
  }

  /**
   * Check if Time Warp stone is equipped
   * @param {object} player - Player entity
   * @returns {boolean}
   */
  isTimeWarpEquipped(player) {
    return player.gauntlet.some((stoneId) => stoneId === 'timeWarp');
  }

  /**
   * Initialize turn-based battle
   * @param {object} player - Player entity
   * @param {object} echo - Echo entity
   * @returns {object} Turn battle state
   */
  startTurnBattle(player, echo) {
    return {
      player: {
        hp: player.hp,
        maxHp: player.maxHp,
        power: player.power,
        defending: false,
      },
      echo: {
        hp: echo.hp,
        maxHp: echo.maxHp,
        power: echo.power,
      },
      turn: 'player',
      turnLog: [],
      isActive: true,
    };
  }

  /**
   * Execute player action in turn battle
   * @param {string} action - 'Attack', 'Defend', 'UseStone', 'Flee'
   * @param {object} turnBattle - Turn battle state
   * @param {object} player - Player entity
   * @returns {object} Updated turn battle state
   */
  executeTurnAction(action, turnBattle, player) {
    if (action === 'Attack') {
      const damage = turnBattle.player.power + Math.floor(Math.random() * 5 - 2);
      turnBattle.echo.hp -= Math.max(1, damage);
      turnBattle.turnLog.push(`Player attacks for ${Math.max(1, damage)} damage!`);
    } else if (action === 'Defend') {
      turnBattle.player.defending = true;
      turnBattle.turnLog.push('Player defends!');
    } else if (action === 'UseStone') {
      // Placeholder for stone effects
      turnBattle.turnLog.push('Player uses a stone!');
    } else if (action === 'Flee') {
      turnBattle.isActive = false;
      turnBattle.turnLog.push('Player flees the battle!');
      return turnBattle;
    }

    // Echo turn
    this.executeEchoTurn(turnBattle, player);

    // Check end conditions
    if (turnBattle.echo.hp <= 0) {
      turnBattle.isActive = false;
      turnBattle.turnLog.push('Echo defeated!');
    } else if (turnBattle.player.hp <= 0) {
      turnBattle.isActive = false;
      turnBattle.turnLog.push('Player defeated!');
    }

    return turnBattle;
  }

  /**
   * Execute echo turn in turn battle
   * @param {object} turnBattle - Turn battle state
   * @param {object} player - Player entity (for reference)
   */
  executeEchoTurn(turnBattle, player) {
    if (!turnBattle.isActive || turnBattle.echo.hp <= 0) {
      return;
    }

    const damage = turnBattle.echo.power + Math.floor(Math.random() * 5 - 2);
    let finalDamage = Math.max(1, damage);

    // Reduce damage if defending
    if (turnBattle.player.defending) {
      finalDamage = Math.max(1, Math.floor(finalDamage * 0.4));
      turnBattle.turnLog.push(
        `Echo attacks for ${finalDamage} damage (defended)!`
      );
      turnBattle.player.defending = false;
    } else {
      turnBattle.turnLog.push(`Echo attacks for ${finalDamage} damage!`);
    }

    turnBattle.player.hp -= finalDamage;
    turnBattle.turn = 'player';
  }
}
