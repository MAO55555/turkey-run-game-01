// Main game runner: input loop, fixed-step simulation, and screenshot mode.

import { STEP } from './config.js';
import { createInput } from './input.js';
import { createRandom } from './random.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { createWorld } from './world.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const shotParam = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const random = createRandom(seed);
const world = createWorld(random);
const renderer = createRenderer(canvas);

// User gesture unlock for procedural WebAudio
function unlockAudio() {
  world.audio.initOnGesture();
  window.removeEventListener('keydown', unlockAudio);
  window.removeEventListener('mousedown', unlockAudio);
  window.removeEventListener('touchstart', unlockAudio);
}
window.addEventListener('keydown', unlockAudio);
window.addEventListener('mousedown', unlockAudio);
window.addEventListener('touchstart', unlockAudio);

function runShot(name) {
  stageShot(name, world);
  world.render(renderer);
  let painted = 0;
  function paint() {
    world.render(renderer);
    painted += 1;
    if (painted < 2) {
      requestAnimationFrame(paint);
    } else {
      window.__shotReady = true;
      document.title = `Shot Ready: ${name}`;
    }
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, renderer.view);
  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    const dt = Math.min(0.25, (now - lastTime) / 1000);
    lastTime = now;
    accumulator += dt;

    while (accumulator >= STEP) {
      world.update(STEP, input);
      input.postUpdate();
      accumulator -= STEP;
    }

    world.render(renderer);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

if (shotParam) {
  runShot(shotParam);
} else {
  runGame();
}
