// Stage progression, distance tracking, and background coordination for Gobbler's Great Getaway.
// Delegates multi-layer parallax art and ground rendering to backgrounds.js.

import { createBackgrounds } from './backgrounds.js';
import { FIELD, PALETTE, STAGES, TOTAL_DISTANCE } from './config.js';

export function createStageManager() {
  const backgrounds = createBackgrounds();
  let stageBanner = null;
  let bannerTimer = 0;
  let lastStageId = 1;

  return {
    backgrounds,

    getCurrentStage(meters) {
      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (meters >= STAGES[i].startMeters) {
          return STAGES[i];
        }
      }
      return STAGES[0];
    },

    update(dt, meters, audio, particles) {
      const current = this.getCurrentStage(meters);
      if (current.id !== lastStageId) {
        lastStageId = current.id;
        stageBanner = `STAGE ${current.id}: ${current.name.toUpperCase()}!`;
        bannerTimer = 3.0;
        audio.playVictory();
        particles.addPopup(stageBanner, FIELD.width / 2, 220, PALETTE.gold, 36, 2.5);
      }

      if (bannerTimer > 0) {
        bannerTimer -= dt;
      }
    },

    drawBackground(ctx, meters, scrollX) {
      const current = this.getCurrentStage(meters);
      const width = FIELD.width;
      const height = FIELD.height;
      const groundY = FIELD.groundY;

      // 1. Sky / Wall Base Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, current.skyColor);
      skyGrad.addColorStop(1, current.skyGradBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, groundY);

      // 2. Parallax Architecture
      if (current.theme === 'farm') {
        backgrounds.drawFarmyard(ctx, width, groundY, scrollX);
      } else if (current.theme === 'barn') {
        backgrounds.drawBarn(ctx, width, groundY, scrollX);
      } else if (current.theme === 'pantry') {
        backgrounds.drawPantry(ctx, width, groundY, scrollX);
      } else if (current.theme === 'kitchen') {
        backgrounds.drawKitchen(ctx, width, groundY, scrollX);
      }

      // 3. Freedom Woods Exit Door (Near 1,000m)
      if (meters >= 940) {
        const exitX = width - (1000 - meters) * 38;
        if (exitX > 50) {
          backgrounds.drawFreedomDoor(ctx, exitX, groundY);
        }
      }

      // 4. Ground, Flooring, and Foreground Details
      backgrounds.drawGround(ctx, width, height, groundY, scrollX, current.theme);
    },
  };
}
