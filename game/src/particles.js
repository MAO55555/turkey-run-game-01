// Particle system for feathers, sparks, dust, mud, confetti, and floating comic text popups.

import { PALETTE } from './config.js';

export function createParticleSystem() {
  const particles = [];
  const popups = [];

  return {
    addDust(x, y, count = 4, vxMin = -40, vxMax = 40) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 6,
          vx: vxMin + Math.random() * (vxMax - vxMin),
          vy: -20 - Math.random() * 40,
          radius: 3 + Math.random() * 4,
          color: Math.random() < 0.5 ? '#E0D0B8' : '#C4B59D',
          alpha: 0.8,
          decay: 1.6 + Math.random() * 0.8,
          type: 'dust',
        });
      }
    },

    addFeathers(x, y, count = 6, burst = false) {
      const colors = [PALETTE.pumpkin, PALETTE.cranberryBright, PALETTE.mustard, PALETTE.deepBrown, PALETTE.softCream];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 120 + Math.random() * 180 : 30 + Math.random() * 70;
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 50,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 10,
          length: 12 + Math.random() * 10,
          width: 5 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1.0,
          decay: burst ? 0.9 : 0.6,
          flutter: Math.random() * 10,
          type: 'feather',
        });
      }
    },

    addFireSparks(x, y, count = 5) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 40,
          vx: -180 - Math.random() * 220,
          vy: -80 + (Math.random() - 0.5) * 160,
          radius: 2 + Math.random() * 4,
          color: Math.random() < 0.6 ? PALETTE.ovenHeat : PALETTE.ovenGlow,
          alpha: 1.0,
          decay: 2.2 + Math.random() * 1.5,
          type: 'spark',
        });
      }
    },

    addMud(x, y, count = 5) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y,
          vx: -100 + (Math.random() - 0.5) * 80,
          vy: -60 - Math.random() * 100,
          radius: 2 + Math.random() * 4,
          color: '#3E2723',
          alpha: 0.9,
          decay: 1.8,
          gravity: 800,
          type: 'mud',
        });
      }
    },

    addConfetti(x, y, count = 30) {
      const colors = [PALETTE.pumpkin, PALETTE.cranberryBright, PALETTE.mustard, PALETTE.gold, '#48BB78', '#4299E1'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 120,
          y: y + (Math.random() - 0.5) * 80,
          vx: -150 + Math.random() * 300,
          vy: -200 - Math.random() * 250,
          length: 8 + Math.random() * 8,
          width: 5 + Math.random() * 4,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1.0,
          decay: 0.5,
          type: 'confetti',
        });
      }
    },

    addPopup(text, x, y, color = PALETTE.gold, fontSize = 24, duration = 1.2) {
      popups.push({
        text,
        x,
        y,
        color,
        fontSize,
        alpha: 1.0,
        scale: 1.3,
        life: duration,
        maxLife: duration,
      });
    },

    update(dt) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.type === 'feather' || p.type === 'confetti') {
          p.rotation += p.rotSpeed * dt;
          p.vy += 80 * dt; // gentle gravity
          p.flutter += dt * 5;
          p.x += Math.sin(p.flutter) * 1.5;
        } else if (p.type === 'mud') {
          p.vy += (p.gravity || 800) * dt;
        } else if (p.type === 'dust') {
          p.radius += 3 * dt;
        }
      }

      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.life -= dt;
        if (pop.life <= 0) {
          popups.splice(i, 1);
          continue;
        }
        pop.y -= 45 * dt;
        const progress = pop.life / pop.maxLife;
        pop.alpha = Math.min(1.0, progress * 1.5);
        if (pop.scale > 1.0) {
          pop.scale = Math.max(1.0, pop.scale - 2.5 * dt);
        }
      }
    },

    draw(ctx) {
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'feather') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.length / 2, p.width / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          // Feather quill spine
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.length / 2, 0);
          ctx.lineTo(p.length / 2, 0);
          ctx.stroke();
          ctx.restore();
        } else if (p.type === 'confetti') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.length / 2, -p.width / 2, p.length, p.width);
          ctx.restore();
        } else if (p.type === 'dust' || p.type === 'mud' || p.type === 'spark') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw popups
      for (let i = 0; i < popups.length; i++) {
        const pop = popups[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.translate(pop.x, pop.y);
        ctx.scale(pop.scale, pop.scale);

        ctx.font = `900 ${pop.fontSize}px Impact, "Arial Black", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Dark outline
        ctx.strokeStyle = '#1A120B';
        ctx.lineWidth = 5;
        ctx.strokeText(pop.text, 0, 0);

        // Bright fill
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, 0, 0);
        ctx.restore();
      }

      ctx.restore();
    },

    clear() {
      particles.length = 0;
      popups.length = 0;
    },
  };
}
