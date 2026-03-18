/**
 * PortalTransition.js - Portal traversal animation and transition logic
 */

export class PortalTransition {
  constructor() {
    this.active = false;
    this.phase = null;
    this.phaseTimer = 0;
    this.targetBranch = null;

    this.ZOOM_OUT_DURATION = 60;
    this.SLICE_VIEW_DURATION = 60;
    this.ZOOM_IN_DURATION = 60;
    this.TOTAL_DURATION =
      this.ZOOM_OUT_DURATION +
      this.SLICE_VIEW_DURATION +
      this.ZOOM_IN_DURATION;
  }

  /**
   * Start a portal transition
   * @param {object} targetBranch - Target branch data
   */
  start(targetBranch) {
    this.active = true;
    this.phase = 'zoomOut';
    this.phaseTimer = 0;
    this.targetBranch = targetBranch;
  }

  /**
   * Update transition animation
   * @param {number} dt - Delta time
   */
  update(dt) {
    if (!this.active) {
      return;
    }

    this.phaseTimer += dt;

    // Advance phase
    if (this.phase === 'zoomOut') {
      if (this.phaseTimer >= this.ZOOM_OUT_DURATION) {
        this.phase = 'sliceView';
        this.phaseTimer = 0;
      }
    } else if (this.phase === 'sliceView') {
      if (this.phaseTimer >= this.SLICE_VIEW_DURATION) {
        this.phase = 'zoomIn';
        this.phaseTimer = 0;
      }
    } else if (this.phase === 'zoomIn') {
      if (this.phaseTimer >= this.ZOOM_IN_DURATION) {
        this.finish();
      }
    }
  }

  /**
   * Check if transition is active
   * @returns {boolean}
   */
  isActive() {
    return this.active;
  }

  /**
   * Get current phase
   * @returns {string|null} 'zoomOut', 'sliceView', 'zoomIn', or null
   */
  getPhase() {
    return this.phase;
  }

  /**
   * Get progress within current phase (0-1)
   * @returns {number}
   */
  getProgress() {
    if (!this.active || this.phase === null) {
      return 0;
    }

    let phaseDuration = 0;
    if (this.phase === 'zoomOut') {
      phaseDuration = this.ZOOM_OUT_DURATION;
    } else if (this.phase === 'sliceView') {
      phaseDuration = this.SLICE_VIEW_DURATION;
    } else if (this.phase === 'zoomIn') {
      phaseDuration = this.ZOOM_IN_DURATION;
    }

    return Math.min(1, this.phaseTimer / phaseDuration);
  }

  /**
   * Get target branch
   * @returns {object}
   */
  getTargetBranch() {
    return this.targetBranch;
  }

  /**
   * Finish transition
   */
  finish() {
    this.active = false;
    this.phase = null;
    this.phaseTimer = 0;
    this.targetBranch = null;
  }
}
