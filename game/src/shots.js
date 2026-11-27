// Staging script for deterministic screenshot capture: ?shot=run|title|kitchen|end&seed=1.
// Constructs authentic game states using actual game entities and renders them faithfully.
// Fully calibrated to display all requested characters, hazards, and UI without overlap.

import { COLLECTIBLES, FIELD, HAZARDS, PALETTE, PLAYER } from './config.js';
import { SCREEN_CAUGHT, SCREEN_PLAY, SCREEN_TITLE } from './screens.js';

export function stageShot(name, world) {
  const turkey = world.turkey;
  const farmer = world.farmer;
  const hazards = world.hazards;
  const particles = world.particles;

  world.hazards.reset();
  world.particles.clear();

  if (name === 'title') {
    world.setScreen(SCREEN_TITLE);
    return;
  }

  if (name === 'run') {
    // ==========================================
    // 1-RUN.JPG (COVER): Peak Action Escape!
    // ==========================================
    world.setScreen(SCREEN_PLAY);

    // Turkey mid-air jump over wooden fence
    turkey.x = 510;
    turkey.y = FIELD.groundY - 145;
    turkey.vy = -160;
    turkey.width = PLAYER.standWidth;
    turkey.height = PLAYER.standHeight;
    turkey.isGrounded = false;
    turkey.isSliding = false;
    turkey.isHidden = false;
    turkey.squishScaleX = 0.92;
    turkey.squishScaleY = 1.15;
    turkey.animTimer = 0.35;
    turkey.lives = 3;
    turkey.decoys = 2;

    // Farmer Barnaby Baste charging close behind (clear 300px separation, NO overlap!)
    farmer.gap = 300;
    farmer.x = turkey.x - farmer.gap;
    farmer.y = FIELD.groundY - farmer.height;
    farmer.isCharging = true;
    farmer.animTimer = 0.2;

    // Wooden fence directly under mid-air turkey
    hazards.obstacles.push({
      kind: HAZARDS.FENCE,
      x: 500,
      y: FIELD.groundY - 55,
      width: 48,
      height: 55,
    });

    // Mud puddle behind fence
    hazards.obstacles.push({
      kind: HAZARDS.MUD,
      x: 360,
      y: FIELD.groundY - 8,
      width: 80,
      height: 16,
    });

    // Flying Carving Knife spinning right behind turkey (just cleared by jump!)
    hazards.obstacles.push({
      kind: HAZARDS.CARVING_KNIFE,
      flying: true,
      rot: 0.32,
      x: 645,
      y: FIELD.groundY - 105,
      width: 58,
      height: 25,
      scoredCloseShave: true,
    });

    // Roasting Oven visible ahead on track, blasting billowing flames
    hazards.obstacles.push({
      kind: HAZARDS.OVEN,
      isBlasting: true,
      cycleTimer: 1.6,
      x: 1040,
      y: FIELD.groundY - 95,
      width: 90,
      height: 95,
    });

    // Golden corn collectibles arcing between knife and oven
    for (let c = 0; c < 4; c++) {
      hazards.collectibles.push({
        kind: COLLECTIBLES.CORN,
        x: 730 + c * 45,
        y: FIELD.groundY - 95 - Math.sin((c / 3) * Math.PI) * 45,
        width: 24,
        height: 24,
      });
    }

    // Golden pumpkin collectible
    hazards.collectibles.push({
      kind: COLLECTIBLES.GOLDEN_PUMPKIN,
      x: 910,
      y: FIELD.groundY - 72,
      width: 32,
      height: 32,
    });

    // Action particles & SINGLE prominent popup in clear open sky (NO overlaps!)
    particles.addFeathers(turkey.x + 30, turkey.y + 40, 6, false);
    particles.addPopup('CLOSE SHAVE! +150', 600, 210, '#FAD02C', 32, 2.0);
    particles.addDust(farmer.x + 30, FIELD.groundY - 2, 4, -40, 40);

    // World score & meter state (Stage 1 Farmyard)
    world.setStats({
      score: 2150,
      meters: 165,
      cornCount: 16,
      closeShaves: 3,
      comboMultiplier: 2,
      scrollX: 950,
    });

    return;
  }

  if (name === 'kitchen') {
    // ==========================================
    // 3-KITCHEN.JPG: The Kitchen Inferno!
    // ==========================================
    world.setScreen(SCREEN_PLAY);

    // Turkey clearly sliding low (135x52, bold outlines, dust trail)
    turkey.x = 440;
    turkey.isSliding = true;
    turkey.slideTimer = 0.45;
    turkey.y = FIELD.groundY - PLAYER.slideHeight;
    turkey.width = PLAYER.slideWidth;
    turkey.height = PLAYER.slideHeight;
    turkey.lives = 2;
    turkey.decoys = 1;

    // Farmer Barnaby Baste with glowing searchlight beam
    farmer.gap = 260;
    farmer.x = turkey.x - farmer.gap;
    farmer.y = FIELD.groundY - farmer.height;
    farmer.searchBeamAngle = 0.18;
    farmer.isSpotted = true;

    // Flying Carving Knife right above sliding turkey (clears turkey back cleanly!)
    hazards.obstacles.push({
      kind: HAZARDS.CARVING_KNIFE,
      flying: true,
      rot: 0.12,
      x: 480,
      y: FIELD.groundY - 86,
      width: 58,
      height: 25,
      scoredCloseShave: true,
    });

    // Table Hiding Spot with draped autumn tablecloth
    hazards.obstacles.push({
      kind: HAZARDS.HIDING_SPOT,
      subKind: 'table',
      x: 610,
      y: FIELD.groundY - 85,
      width: 110,
      height: 85,
    });

    // The Roasting Oven blasting billowing fire!
    hazards.obstacles.push({
      kind: HAZARDS.OVEN,
      isBlasting: true,
      cycleTimer: 1.8,
      x: 780,
      y: FIELD.groundY - 95,
      width: 90,
      height: 95,
    });

    // Chopping cleaver on cutting board ahead
    hazards.obstacles.push({
      kind: HAZARDS.CARVING_KNIFE,
      chopping: true,
      chopTimer: 1.2,
      yOffset: 35,
      x: 1050,
      y: FIELD.groundY - 95,
      width: 50,
      height: 70,
    });

    // Fire sparks from oven & slide dust, and ONE single popup placed in clear space
    particles.addFireSparks(780, FIELD.groundY - 45, 12);
    particles.addDust(turkey.x + 10, FIELD.groundY - 2, 6, -140, -40);
    particles.addPopup('SLIDE!', 490, 360, '#81C784', 32, 2.0);

    // Advanced kitchen state (Stage 4 Kitchen)
    world.setStats({
      score: 4850,
      meters: 820,
      cornCount: 39,
      closeShaves: 8,
      comboMultiplier: 3,
      scrollX: 3500,
    });

    return;
  }

  if (name === 'end') {
    // ==========================================
    // 4-END.JPG: Caught ("Stuffed & Served!")
    // ==========================================
    world.setScreen(SCREEN_CAUGHT);

    world.setStats({
      score: 5620,
      meters: 890,
      cornCount: 44,
      closeShaves: 9,
      stageName: 'The Kitchen',
    });

    particles.addFeathers(265, 460, 8, true);
    return;
  }
}
