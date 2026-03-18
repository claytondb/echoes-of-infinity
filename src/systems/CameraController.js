/**
 * CameraController.js - Camera follow and zoom control
 */

import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE } from '../data/GameConfig.js';

export class CameraController {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.targetZoom = 1;
  }

  /**
   * Update camera position and zoom
   * @param {object} player - Player entity
   * @param {object} echo - Echo entity (can be null)
   * @param {number} canvasWidth - Canvas width
   * @param {number} canvasHeight - Canvas height
   */
  update(player, echo, canvasWidth, canvasHeight) {
    const ZOOM_SPEED = 2;
    const CAMERA_SPEED = 3;

    // Determine target zoom based on echo proximity
    this.targetZoom = 1;
    let targetCenterX = player.x + player.w / 2;
    let targetCenterY = player.y + player.h / 2;

    if (echo && echo.hp > 0) {
      const dx = echo.x - player.x;
      const dy = echo.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Zoom in when close to echo
      if (distance < 300) {
        const zoomFactor = Math.max(1, 1.6 - distance / 300);
        this.targetZoom = zoomFactor;

        // Center between player and echo
        targetCenterX = (player.x + echo.x + echo.w / 2) / 2;
        targetCenterY = (player.y + echo.y + echo.h / 2) / 2;
      }
    }

    // Smooth zoom transition
    this.zoom += (this.targetZoom - this.zoom) * ZOOM_SPEED * 0.016;

    // Smooth camera movement
    const viewportWidth = canvasWidth / this.zoom;
    const viewportHeight = canvasHeight / this.zoom;

    this.x += (targetCenterX - viewportWidth / 2 - this.x) * CAMERA_SPEED * 0.016;
    this.y +=
      (targetCenterY - viewportHeight / 2 - this.y) * CAMERA_SPEED * 0.016;

    // Clamp to world bounds
    this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH * TILE_SIZE - viewportWidth));
    this.y = Math.max(0, Math.min(this.y, WORLD_HEIGHT * TILE_SIZE - viewportHeight));

    // Clamp zoom
    this.zoom = Math.max(0.5, Math.min(this.zoom, 2));
  }
}
