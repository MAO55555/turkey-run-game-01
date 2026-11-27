// Complete world simulation: game loop state, physics integration, collisions, scoring, and screen transitions.

import { createAudio } from './audio.js';
import { FIELD, PLAYER, SCORES, STEP, STORAGE_KEYS, TOTAL_DISTANCE } from './config.js';
import { createFarmer } from './farmer.js';
import { createHazardManager } from './hazards.js';
import { createHUD } from './hud.js';
import { createParticleSystem } from './particles.js';
import { createRandom } from './random.js';
import { createRenderer } from './render.js';
import {
  createScreens,
  SCREEN_CAUGHT,
  SCREEN_ESCAPED,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TITLE,
} from './screens.js';
import { createStageManager } from './stages.js';
import { createTurkey } from './turkey.js';

export function createWorld(random = createRandom(1337)) {
  const audio = createAudio();
  const particles = createParticleSystem();
  const turkey = createTurkey();
  const farmer = createFarmer();
  const hazards = createHazardManager(random);
  const stages = createStageManager();
  const hud = createHUD();
  const screens = createScreens();

  let screen = SCREEN_TITLE;
  let score = 0;
  let meters = 0;
  let scrollX = 0;
  let cornCount = 0;
  let closeShaves = 0;
  let comboMultiplier = 1;
  let comboTimer = 0;
  let bestScore = 0;
  let bestMeters = 0;

  try {
    bestScore = Number.parseInt(window.localStorage.getItem(STORAGE_KEYS.BEST_SCORE) ?? '0', 10) || 0;
    bestMeters = Number.parseInt(window.localStorage.getItem(STORAGE_KEYS.BEST_METERS) ?? '0', 10) || 0;
  } catch {}

  function saveBest() {
    if (score > bestScore) {
      bestScore = score;
      try {
        window.localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(bestScore));
      } catch {}
    }
    if (Math.floor(meters) > bestMeters) {
      bestMeters = Math.floor(meters);
      try {
        window.localStorage.setItem(STORAGE_KEYS.BEST_METERS, String(bestMeters));
      } catch {}
    }
  }

  function startRun() {
    turkey.reset();
    farmer.reset();
    hazards.reset();
    particles.clear();
    score = 0;
    meters = 0;
    scrollX = 0;
    cornCount = 0;
    closeShaves = 0;
    comboMultiplier = 1;
    comboTimer = 0;
    screen = SCREEN_PLAY;
    audio.playGobble();
  }

  function onScore(pts, popupText, color) {
    const finalPts = pts * comboMultiplier;
    score += finalPts;
    comboMultiplier = Math.min(4, comboMultiplier + 1);
    comboTimer = 3.5;

    if (popupText) {
      particles.addPopup(
        comboMultiplier > 1 ? `${popupText} (x${comboMultiplier})` : popupText,
        turkey.x + 35,
        turkey.y - 15,
        color || '#FAD02C',
        22,
        1.1
      );
    }

    if (pts === SCORES.CORN || pts === SCORES.GOLDEN_PUMPKIN) {
      cornCount++;
    } else if (pts === SCORES.CLOSE_SHAVE) {
      closeShaves++;
    }
  }

  return {
    audio,
    particles,
    turkey,
    farmer,
    hazards,
    stages,
    hud,
    screens,
    getScreen() {
      return screen;
    },
    setScreen(s) {
      screen = s;
    },
    getScore() {
      return score;
    },
    getMeters() {
      return meters;
    },
    setStats(custom) {
      if (custom.score !== undefined) score = custom.score;
      if (custom.meters !== undefined) meters = custom.meters;
      if (custom.cornCount !== undefined) cornCount = custom.cornCount;
      if (custom.closeShaves !== undefined) closeShaves = custom.closeShaves;
      if (custom.comboMultiplier !== undefined) comboMultiplier = custom.comboMultiplier;
      if (custom.scrollX !== undefined) scrollX = custom.scrollX;
    },
    getStats() {
      return {
        score,
        meters,
        cornCount,
        closeShaves,
        stageName: stages.getCurrentStage(meters).name,
      };
    },
    getBestScore() {
      return bestScore;
    },
    getBestMeters() {
      return bestMeters;
    },

    startRun,

    update(dt, input) {
      // Audio toggle
      if (input.wasMuteJustPressed()) {
        audio.toggleMute();
      }

      // Check pause
      if (input.wasPauseJustPressed()) {
        if (screen === SCREEN_PLAY) {
          screen = SCREEN_PAUSED;
        } else if (screen === SCREEN_PAUSED) {
          screen = SCREEN_PLAY;
        }
      }

      // Screen-specific state updates
      if (screen === SCREEN_TITLE) {
        if (input.wasJumpJustPressed() || input.wasRestartJustPressed()) {
          startRun();
        } else {
          const mouse = input.getMouse();
          if (mouse.justClicked) {
            const btn = screens.hitTest(mouse.x, mouse.y);
            if (btn === 'play') {
              startRun();
            }
          }
        }
        return;
      }

      if (screen === SCREEN_CAUGHT || screen === SCREEN_ESCAPED) {
        if (input.wasRestartJustPressed() || input.wasJumpJustPressed()) {
          startRun();
        } else {
          const mouse = input.getMouse();
          if (mouse.justClicked) {
            const btn = screens.hitTest(mouse.x, mouse.y);
            if (btn === 'restart') {
              startRun();
            }
          }
        }
        return;
      }

      if (screen === SCREEN_PAUSED) {
        return;
      }

      // ==========================================
      // SCREEN_PLAY LOGIC
      // ==========================================

      // Mouse click or F key tosses decoy corn!
      if (input.wasDecoyJustPressed() && turkey.decoys > 0) {
        turkey.decoys--;
        hazards.spawnDecoy(turkey.x - 20, turkey.y + 20);
        audio.playDecoyToss();
        particles.addPopup('DECOY TOSS!', turkey.x - 10, turkey.y - 20, '#81C784', 24, 1.2);
      }

      // Horizontal speed adjustment: Left slows down, Right surges forward
      let currentRunSpeed = PLAYER.runSpeed;
      if (input.isRight()) {
        currentRunSpeed += PLAYER.maxSpeedBonus;
      } else if (input.isLeft()) {
        currentRunSpeed -= 60;
      }

      // Combo timer decay
      if (comboTimer > 0) {
        comboTimer -= dt;
        if (comboTimer <= 0) {
          comboMultiplier = 1;
        }
      }

      // World advance
      const distAdvance = (currentRunSpeed * dt) / 38; // meters
      meters += distAdvance;
      scrollX += currentRunSpeed * dt;
      score += Math.floor(distAdvance);

      const currentStage = stages.getCurrentStage(meters);
      stages.update(dt, meters, audio, particles);

      // Check if hiding spot overlapping
      const hidingSpot = hazards.getCurrentHidingSpot(turkey);

      // Update turkey physics
      turkey.update(dt, input, audio, particles, hidingSpot);

      // Update farmer AI
      farmer.update(dt, turkey, currentStage, hazards.decoys, audio, particles);

      // Update hazards & collectibles
      hazards.update(dt, scrollX, currentRunSpeed, currentStage, turkey, farmer, audio, particles, onScore);

      // Check collisions between turkey and active hazards
      hazards.checkHazardCollisions(turkey, farmer, audio, particles);

      // Check caught condition
      if (turkey.lives <= 0 || farmer.isCaught(turkey)) {
        screen = SCREEN_CAUGHT;
        audio.playCaught();
        saveBest();
        return;
      }

      // Check escaped condition
      if (meters >= TOTAL_DISTANCE) {
        screen = SCREEN_ESCAPED;
        score += SCORES.ESCAPE_BONUS;
        audio.playVictory();
        particles.addConfetti(FIELD.width / 2, FIELD.height / 2, 80);
        saveBest();
        return;
      }

      // Update particles
      particles.update(dt);
    },

    render(renderer) {
      renderer.beginFrame();
      const ctx = renderer.ctx;

      if (screen === SCREEN_TITLE) {
        screens.drawTitle(ctx, renderer, bestScore, bestMeters, audio.isMuted());
        return;
      }

      if (screen === SCREEN_CAUGHT) {
        screens.drawCaught(ctx, renderer, this.getStats(), bestScore);
        particles.draw(ctx);
        return;
      }

      if (screen === SCREEN_ESCAPED) {
        screens.drawEscaped(ctx, renderer, this.getStats(), bestScore);
        particles.draw(ctx);
        return;
      }

      // Draw active play world
      const currentStage = stages.getCurrentStage(meters);

      // 1. Parallax Stage Background
      stages.drawBackground(ctx, meters, scrollX);

      // 2. Obstacles, Hiding Spots, and Hazards
      for (let i = 0; i < hazards.obstacles.length; i++) {
        renderer.drawObstacle(hazards.obstacles[i]);
      }

      // 3. Tossed Decoys
      for (let i = 0; i < hazards.decoys.length; i++) {
        if (hazards.decoys[i].active) {
          renderer.drawDecoy(hazards.decoys[i]);
        }
      }

      // 4. Collectibles (Corn & Pumpkins)
      for (let i = 0; i < hazards.collectibles.length; i++) {
        renderer.drawCollectible(hazards.collectibles[i]);
      }

      // 5. Farmer Barnaby Baste
      renderer.drawFarmer(farmer, currentStage);

      // 6. Turkey (Player)
      renderer.drawTurkey(turkey);

      // 7. Particles & Popups
      particles.draw(ctx);

      // 8. HUD
      hud.draw(ctx, {
        score,
        meters,
        turkey,
        farmer,
        currentStage,
        comboMultiplier,
        isMuted: audio.isMuted(),
      });

      // 9. Paused Overlay if paused
      if (screen === SCREEN_PAUSED) {
        screens.drawPaused(ctx);
      }
    },
  };
}
