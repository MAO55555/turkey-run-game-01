// Hazards, obstacles, hiding spots, and collectibles for Gobbler's Great Getaway.

import { COLLECTIBLES, FIELD, HAZARDS, PALETTE, PLAYER, SCORES } from './config.js';

export function createHazardManager(random) {
  const obstacles = [];
  const collectibles = [];
  const decoys = [];

  let nextSpawnDist = 200; // world distance in pixels for next spawn
  let lastCloseShaveId = -1;

  return {
    obstacles,
    collectibles,
    decoys,

    reset() {
      obstacles.length = 0;
      collectibles.length = 0;
      decoys.length = 0;
      nextSpawnDist = 200;
      lastCloseShaveId = -1;
    },

    spawnDecoy(x, y) {
      decoys.push({
        x,
        y: FIELD.groundY - 18,
        vy: -120,
        vx: -140, // tosses backward towards farmer
        active: true,
        settled: false,
        timer: 6.0,
      });
    },

    update(dt, worldDist, scrollSpeed, currentStage, turkey, farmer, audio, particles, onScore) {
      // Update tossed decoys
      for (let i = decoys.length - 1; i >= 0; i--) {
        const d = decoys[i];
        if (!d.settled) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vy += 800 * dt;
          if (d.y >= FIELD.groundY - 18) {
            d.y = FIELD.groundY - 18;
            d.vy = 0;
            d.vx = 0;
            d.settled = true;
          }
        }
        // Scroll with world
        d.x -= scrollSpeed * dt;
        d.timer -= dt;
        if (d.timer <= 0 || d.x < -100 || !d.active) {
          decoys.splice(i, 1);
        }
      }

      // Check procedural spawning based on current world distance
      if (worldDist >= nextSpawnDist && worldDist < 1000 * 50) {
        this.spawnStagePattern(currentStage, worldDist);
        nextSpawnDist = worldDist + random.range(260, 420);
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= scrollSpeed * dt;

        // Specific hazard animations
        if (obs.kind === HAZARDS.OVEN) {
          obs.cycleTimer = (obs.cycleTimer || 0) + dt;
          if (obs.cycleTimer > 3.2) obs.cycleTimer = 0;
          // Oven door open & blast between 1.2s and 2.6s
          obs.isBlasting = obs.cycleTimer > 1.2 && obs.cycleTimer < 2.6;
          if (obs.isBlasting && Math.random() < 0.3) {
            particles.addFireSparks(obs.x + 10, obs.y + 40, 3);
          }
        } else if (obs.kind === HAZARDS.CARVING_KNIFE) {
          if (obs.flying) {
            obs.x -= obs.flySpeed * dt; // flies toward player faster
            obs.rot = (obs.rot || 0) + dt * 14;
          } else if (obs.chopping) {
            obs.chopTimer = (obs.chopTimer || 0) + dt * 4;
            obs.yOffset = Math.max(0, Math.sin(obs.chopTimer) * 70);
          }
        } else if (obs.kind === HAZARDS.ROLLING_PIN) {
          obs.x -= 80 * dt; // rolls towards player
          obs.rot = (obs.rot || 0) - dt * 10;
        }

        // Near-miss / Close Shave detection for bonus points
        if (
          !obs.scoredCloseShave &&
          obs.id !== lastCloseShaveId &&
          obs.kind !== HAZARDS.HIDING_SPOT &&
          obs.kind !== HAZARDS.MUD
        ) {
          const turkeyBox = turkey.getHitbox();
          const dx = Math.abs(turkeyBox.x + turkeyBox.width / 2 - (obs.x + obs.width / 2));
          const dy = Math.abs(turkeyBox.y + turkeyBox.height / 2 - (obs.y + obs.height / 2));

          // If close but NOT touching
          if (dx < 70 && dy < 65 && obs.x < turkeyBox.x + 30) {
            obs.scoredCloseShave = true;
            lastCloseShaveId = obs.id;
            onScore(SCORES.CLOSE_SHAVE, 'CLOSE SHAVE! +150', '#FAD02C');
            audio.playCloseShave();
            particles.addFeathers(turkey.x + 40, turkey.y + 20, 5, false);
          }
        }

        // Clean up offscreen obstacles
        if (obs.x + obs.width < -150) {
          obstacles.splice(i, 1);
        }
      }

      // Update collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        item.x -= scrollSpeed * dt;
        item.floatOffset = Math.sin((worldDist * 0.05) + i) * 6;

        // Collision with turkey
        const turkeyBox = turkey.getHitbox();
        const itemBox = {
          x: item.x,
          y: item.y + item.floatOffset,
          width: item.width,
          height: item.height,
        };

        if (this.checkOverlap(turkeyBox, itemBox)) {
          if (item.kind === COLLECTIBLES.CORN) {
            onScore(SCORES.CORN, '+50 CORN', '#FFE082');
            audio.playCorn();
            particles.addDust(item.x, item.y, 4, -40, 40);
          } else if (item.kind === COLLECTIBLES.GOLDEN_PUMPKIN) {
            onScore(SCORES.GOLDEN_PUMPKIN, '+250 PUMPKIN!', '#FF9800');
            audio.playPumpkin();
            particles.addConfetti(item.x, item.y, 16);
          } else if (item.kind === COLLECTIBLES.DECOY_BAG) {
            turkey.decoys = Math.min(PLAYER.maxDecoys, turkey.decoys + 1);
            onScore(100, '+1 DECOY CORN', '#81C784');
            audio.playCorn();
            particles.addPopup('+1 DECOY BAG', item.x, item.y - 20, '#81C784', 24, 1.2);
          }
          collectibles.splice(i, 1);
          continue;
        }

        if (item.x + item.width < -100) {
          collectibles.splice(i, 1);
        }
      }
    },

    spawnStagePattern(stage, dist) {
      const spawnX = 1380;
      const theme = stage.theme;

      // Spawn hiding spots periodically
      if (random.chance(0.28)) {
        obstacles.push({
          id: Math.floor(Math.random() * 100000),
          kind: HAZARDS.HIDING_SPOT,
          subKind: theme === 'farm' ? 'haystack' : theme === 'barn' ? 'haystack' : theme === 'pantry' ? 'barrel' : 'table',
          x: spawnX,
          y: FIELD.groundY - 80,
          width: 85,
          height: 80,
        });
      }

      // Stage-specific hazards
      if (theme === 'farm') {
        const roll = random.next();
        if (roll < 0.45) {
          // Wooden fence hurdle
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.FENCE,
            x: spawnX,
            y: FIELD.groundY - 55,
            width: 48,
            height: 55,
          });
        } else if (roll < 0.75) {
          // Mud puddle
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.MUD,
            x: spawnX,
            y: FIELD.groundY - 8,
            width: 90,
            height: 16,
          });
        } else {
          // Hay bale jump
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.HAYBALE,
            x: spawnX,
            y: FIELD.groundY - 50,
            width: 60,
            height: 50,
          });
        }
      } else if (theme === 'barn') {
        const roll = random.next();
        if (roll < 0.45) {
          // Flying carving knife (slide under!)
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.CARVING_KNIFE,
            flying: true,
            flySpeed: 240,
            x: spawnX,
            y: FIELD.groundY - 60,
            width: 55,
            height: 24,
          });
        } else {
          // Low wooden beam (must slide)
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.FENCE,
            beam: true,
            x: spawnX,
            y: FIELD.groundY - 85,
            width: 70,
            height: 48, // clearance underneath is 37px, turkey can slide under!
          });
        }
      } else if (theme === 'pantry') {
        const roll = random.next();
        if (roll < 0.5) {
          // Rolling pin on floor
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.ROLLING_PIN,
            x: spawnX,
            y: FIELD.groundY - 32,
            width: 50,
            height: 32,
          });
        } else {
          // Flying knife
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.CARVING_KNIFE,
            flying: true,
            flySpeed: 260,
            x: spawnX,
            y: FIELD.groundY - 60,
            width: 55,
            height: 24,
          });
        }
      } else if (theme === 'kitchen') {
        const roll = random.next();
        if (roll < 0.45) {
          // The dreaded Oven blasting fire!
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.OVEN,
            cycleTimer: 1.0,
            isBlasting: true,
            x: spawnX,
            y: FIELD.groundY - 95,
            width: 90,
            height: 95,
          });
        } else if (roll < 0.8) {
          // Flying carving knife
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.CARVING_KNIFE,
            flying: true,
            flySpeed: 290,
            x: spawnX,
            y: FIELD.groundY - 58,
            width: 58,
            height: 25,
          });
        } else {
          // Chopping cleaver down from above
          obstacles.push({
            id: Math.floor(Math.random() * 100000),
            kind: HAZARDS.CARVING_KNIFE,
            chopping: true,
            chopTimer: 0,
            yOffset: 0,
            x: spawnX,
            y: FIELD.groundY - 95,
            width: 50,
            height: 70,
          });
        }
      }

      // Spawn Corn collectibles in arc or row
      const cornPattern = random.rangeInt(1, 3);
      for (let c = 0; c < cornPattern; c++) {
        collectibles.push({
          kind: COLLECTIBLES.CORN,
          x: spawnX + 80 + c * 38,
          y: FIELD.groundY - 80 - (cornPattern > 1 ? Math.sin((c / (cornPattern - 1)) * Math.PI) * 45 : 0),
          width: 24,
          height: 24,
        });
      }

      // Golden pumpkin chance
      if (random.chance(0.25)) {
        collectibles.push({
          kind: COLLECTIBLES.GOLDEN_PUMPKIN,
          x: spawnX + 220,
          y: FIELD.groundY - 90,
          width: 32,
          height: 32,
        });
      }

      // Decoy corn pickup chance
      if (random.chance(0.2)) {
        collectibles.push({
          kind: COLLECTIBLES.DECOY_BAG,
          x: spawnX + 160,
          y: FIELD.groundY - 60,
          width: 28,
          height: 28,
        });
      }
    },

    getCurrentHidingSpot(turkey) {
      const turkeyBox = turkey.getHitbox();
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.kind === HAZARDS.HIDING_SPOT) {
          if (this.checkOverlap(turkeyBox, obs)) {
            return obs;
          }
        }
      }
      return null;
    },

    checkHazardCollisions(turkey, farmer, audio, particles) {
      if (turkey.invincibleTimer > 0) return;
      const turkeyBox = turkey.getHitbox();

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.kind === HAZARDS.HIDING_SPOT) continue;

        if (obs.kind === HAZARDS.MUD) {
          if (this.checkOverlap(turkeyBox, obs)) {
            farmer.penalizeMudSlow(1 / 60);
            if (Math.random() < 0.2) {
              particles.addMud(turkey.x + 25, FIELD.groundY - 2, 2);
            }
          }
          continue;
        }

        let hazardBox = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };

        if (obs.kind === HAZARDS.OVEN) {
          if (obs.isBlasting) {
            // Oven blast extends to the left!
            hazardBox = {
              x: obs.x - 35,
              y: obs.y + 15,
              width: obs.width + 35,
              height: obs.height - 15,
            };
          } else {
            // closed oven is just solid box
            hazardBox = { x: obs.x + 10, y: obs.y + 10, width: obs.width - 20, height: obs.height - 10 };
          }
        } else if (obs.kind === HAZARDS.CARVING_KNIFE && obs.chopping) {
          hazardBox.y = obs.y + obs.yOffset;
        }

        if (this.checkOverlap(turkeyBox, hazardBox)) {
          if (turkey.takeHit(audio, particles)) {
            farmer.penalizeTurkeyStumble(particles);
            if (obs.kind === HAZARDS.OVEN) {
              audio.playOvenBlast();
            } else if (obs.kind === HAZARDS.CARVING_KNIFE) {
              audio.playKnifeSwish();
            }
            break;
          }
        }
      }
    },

    checkOverlap(r1, r2) {
      return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
      );
    },
  };
}
