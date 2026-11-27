// WebAudio procedural sound synthesizer. No audio files or external assets required.
// Audio starts strictly after the first user gesture.

import { STORAGE_KEYS } from './config.js';

export function createAudio() {
  let ctx = null;
  let muted = false;
  let bgmTimer = null;
  let bgmStep = 0;

  try {
    muted = window.localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED) === 'true';
  } catch {
    muted = false;
  }

  function getContext() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.2, endFreq = null) {
    if (muted) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      if (endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), ac.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start();
      osc.stop(ac.currentTime + duration);
    } catch {
      // Audio node error safeguard
    }
  }

  function playNoise(duration, gainVal = 0.15, filterFreq = 1000) {
    if (muted) return;
    const ac = getContext();
    if (!ac) return;

    try {
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ac.createBufferSource();
      noise.buffer = buffer;

      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ac.currentTime + duration);

      const gain = ac.createGain();
      gain.gain.setValueAtTime(gainVal, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      noise.start();
    } catch {
      // Audio safeguard
    }
  }

  return {
    initOnGesture() {
      getContext();
    },
    toggleMute() {
      muted = !muted;
      try {
        window.localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, String(muted));
      } catch {}
      return muted;
    },
    isMuted() {
      return muted;
    },

    // Turkey gobble (frequency modulated warble)
    playGobble() {
      if (muted) return;
      const ac = getContext();
      if (!ac) return;
      try {
        const osc = ac.createOscillator();
        const mod = ac.createOscillator();
        const modGain = ac.createGain();
        const gain = ac.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, ac.currentTime);

        mod.type = 'sine';
        mod.frequency.setValueAtTime(32, ac.currentTime);
        modGain.gain.setValueAtTime(75, ac.currentTime);

        mod.connect(osc.frequency);

        gain.gain.setValueAtTime(0.22, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ac.destination);

        osc.start();
        mod.start();
        osc.stop(ac.currentTime + 0.35);
        mod.stop(ac.currentTime + 0.35);
      } catch {}
    },

    // Jump chirp
    playJump() {
      playTone(220, 0.18, 'sine', 0.2, 540);
    },

    // Wing flap
    playFlap() {
      playNoise(0.12, 0.14, 1800);
      playTone(180, 0.1, 'triangle', 0.1, 100);
    },

    // Slide swoosh
    playSlide() {
      playNoise(0.25, 0.18, 900);
    },

    // Corn kernel pickup
    playCorn() {
      playTone(523.25, 0.08, 'sine', 0.18);
      setTimeout(() => playTone(659.25, 0.12, 'sine', 0.18), 40);
    },

    // Golden pumpkin chime
    playPumpkin() {
      playTone(587.33, 0.1, 'triangle', 0.2);
      setTimeout(() => playTone(739.99, 0.1, 'triangle', 0.2), 60);
      setTimeout(() => playTone(880.0, 0.15, 'sine', 0.25), 120);
      setTimeout(() => playTone(1174.66, 0.25, 'sine', 0.25), 180);
    },

    // Close shave sting!
    playCloseShave() {
      playTone(700, 0.22, 'triangle', 0.22, 1100);
    },

    // Spotted alert sting!
    playSpotted() {
      playTone(330, 0.25, 'sawtooth', 0.25, 220);
      setTimeout(() => playTone(440, 0.3, 'sawtooth', 0.28, 290), 80);
    },

    // Carving knife slice swish
    playKnifeSwish() {
      playNoise(0.18, 0.2, 4000);
      playTone(900, 0.15, 'sine', 0.15, 300);
    },

    // Oven blast roar
    playOvenBlast() {
      playNoise(0.6, 0.3, 500);
      playTone(85, 0.5, 'sawtooth', 0.2, 55);
    },

    // Decoy toss
    playDecoyToss() {
      playTone(320, 0.15, 'sine', 0.2, 180);
    },

    // Stumble / Hit
    playHit() {
      playTone(140, 0.25, 'square', 0.25, 60);
      playNoise(0.2, 0.25, 800);
    },

    // Caught / Game Over
    playCaught() {
      playTone(280, 0.3, 'sawtooth', 0.3, 240);
      setTimeout(() => playTone(240, 0.3, 'sawtooth', 0.3, 200), 280);
      setTimeout(() => playTone(200, 0.5, 'sawtooth', 0.35, 130), 560);
    },

    // Freedom victory fanfare
    playVictory() {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((f, idx) => {
        setTimeout(() => playTone(f, 0.3 + idx * 0.1, 'triangle', 0.25), idx * 140);
      });
    },

    // Light acoustic rhythm tick
    playRhythmBeat() {
      if (muted) return;
      playNoise(0.04, 0.05, 3000);
    },
  };
}
