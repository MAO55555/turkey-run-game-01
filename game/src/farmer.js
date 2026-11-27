// Farmer Barnaby Baste entity: Pursues turkey, gains ground on stumbles, sweeps search beam, distracted by corn decoys.

import { FARMER, FIELD, PLAYER } from './config.js';

export function createFarmer() {
  return {
    gap: FARMER.startingGap,
    width: FARMER.width,
    height: FARMER.height,
    x: PLAYER.screenX - FARMER.startingGap,
    y: FIELD.groundY - FARMER.height,

    isCharging: false,
    chargeTimer: 0,
    isDistracted: false,
    distractedTimer: 0,

    searchBeamAngle: 0,
    beamSweepSpeed: 1.8,
    isSpotted: false,
    spottedCooldown: 0,

    animFrame: 0,
    animTimer: 0,
    sweatTimer: 0,

    reset() {
      this.gap = FARMER.startingGap;
      this.x = PLAYER.screenX - this.gap;
      this.y = FIELD.groundY - FARMER.height;
      this.isCharging = false;
      this.chargeTimer = 0;
      this.isDistracted = false;
      this.distractedTimer = 0;
      this.searchBeamAngle = 0;
      this.isSpotted = false;
      this.spottedCooldown = 0;
      this.animFrame = 0;
      this.animTimer = 0;
    },

    update(dt, turkey, activeStage, activeDecoys, audio, particles) {
      // Cooldowns
      if (this.spottedCooldown > 0) {
        this.spottedCooldown -= dt;
      }

      // Check decoy distraction
      if (this.isDistracted) {
        this.distractedTimer -= dt;
        if (this.distractedTimer <= 0) {
          this.isDistracted = false;
        }
      } else {
        // Check if farmer walked over any active decoy
        for (let i = 0; i < activeDecoys.length; i++) {
          const decoy = activeDecoys[i];
          if (decoy.active && Math.abs(this.x + this.width / 2 - decoy.x) < 40) {
            decoy.active = false;
            this.isDistracted = true;
            this.distractedTimer = FARMER.decoyDistractDuration;
            this.isCharging = false;
            audio.playGobble();
            particles.addPopup('DISTRACTED! +GAP', this.x + 50, this.y - 20, '#FFE082', 26, 1.5);
            particles.addFeathers(decoy.x, decoy.y, 8, true);
            break;
          }
        }
      }

      // Charge timer
      if (this.isCharging) {
        this.chargeTimer -= dt;
        if (this.chargeTimer <= 0) {
          this.isCharging = false;
        }
      }

      // Search beam logic (Barn & Kitchen stages)
      const hasSearchBeam = activeStage.theme === 'barn' || activeStage.theme === 'kitchen';
      if (hasSearchBeam) {
        this.searchBeamAngle += this.beamSweepSpeed * dt;
        const currentAngleRad = Math.sin(this.searchBeamAngle) * 0.25;

        // Check if beam intersects turkey while turkey is NOT hidden
        if (!turkey.isHidden && this.spottedCooldown <= 0) {
          const beamEndX = this.x + 120 + Math.cos(currentAngleRad) * FARMER.searchBeamRange;
          if (beamEndX >= turkey.x && this.gap > 80) {
            this.isSpotted = true;
            this.isCharging = true;
            this.chargeTimer = 2.2;
            this.spottedCooldown = 3.5;
            audio.playSpotted();
            particles.addPopup('SPOTTED!', turkey.x, turkey.y - 30, '#FF1744', 34, 1.4);
          }
        }
      } else {
        this.isSpotted = false;
      }

      // Adjust Gap
      if (this.isDistracted) {
        // Turkey widens gap while farmer is stopped munching corn!
        this.gap = Math.min(FARMER.maxGap, this.gap + 140 * dt);
      } else {
        let closingRate = 0;
        if (this.isCharging) {
          closingRate += 90;
        }
        if (turkey.isSliding) {
          // slight gap loss while sliding to reward timing
          closingRate += 15;
        } else {
          // clean run slowly recovers gap
          this.gap = Math.min(FARMER.maxGap, this.gap + 20 * dt);
        }

        this.gap = Math.max(FARMER.minGap, this.gap - closingRate * dt);
      }

      // Farmer screen X is locked to Turkey screen X minus gap
      this.x = turkey.x - this.gap;

      // Animation frames
      this.animTimer += dt;
      const speedFactor = this.isDistracted ? 0.3 : this.isCharging ? 0.06 : 0.1;
      if (this.animTimer > speedFactor) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
      }

      // Angry sweat / steam
      if (this.isCharging) {
        this.sweatTimer += dt;
        if (this.sweatTimer > 0.2) {
          this.sweatTimer = 0;
          particles.addDust(this.x + 40, this.y + 10, 2, -20, 20);
        }
      }
    },

    penalizeTurkeyStumble(particles) {
      this.gap = Math.max(FARMER.minGap, this.gap - FARMER.hitStumblePenalty);
      particles.addPopup('FARMER CLOSING IN!', this.x + 80, this.y - 15, '#FF5252', 26, 1.3);
    },

    penalizeMudSlow(dt) {
      this.gap = Math.max(FARMER.minGap, this.gap - FARMER.mudSlowPenalty * dt);
    },

    isCaught(turkey) {
      return this.gap <= FARMER.catchDistance;
    },
  };
}
