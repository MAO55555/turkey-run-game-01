// Procedural drawing engine for Turkey, Farmer Barnaby Baste, Hazards, Ovens, Knives, and Collectibles.
// All art is drawn via procedural 2D canvas paths. Zero external images or emojis.

import { COLLECTIBLES, FARMER, FIELD, HAZARDS, PALETTE, PLAYER } from './config.js';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round((window.innerWidth || 1280) * ratio);
    const height = Math.round((window.innerHeight || 720) * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  resize();
  window.addEventListener('resize', resize);

  return {
    ctx,
    view,
    resize,

    beginFrame() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#11141b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    },

    // ==========================================
    // PROCEDURAL TURKEY (HERO - 2X BIGGER)
    // ==========================================
    drawTurkey(turkey) {
      ctx.save();
      ctx.translate(turkey.x + turkey.width / 2, turkey.y + turkey.height / 2);
      ctx.scale(turkey.squishScaleX || 1.0, turkey.squishScaleY || 1.0);

      // Flashing if invulnerable after hit
      if (turkey.invincibleTimer > 0 && Math.floor(turkey.invincibleTimer * 15) % 2 === 0) {
        ctx.globalAlpha = 0.45;
      }

      if (turkey.isHidden) {
        this.drawTurkeyHiding(turkey);
      } else if (turkey.isSliding) {
        this.drawTurkeySliding(turkey);
      } else {
        this.drawTurkeyRunning(turkey);
      }

      ctx.restore();
    },

    drawTurkeyRunning(turkey) {
      const legCycle = turkey.isGrounded ? Math.sin(turkey.animTimer * 26) : 0;
      const bounce = turkey.isGrounded ? Math.abs(Math.sin(turkey.animTimer * 26)) * 6 : 0;

      ctx.save();
      ctx.translate(0, -bounce);

      // 1. Large Fanned Tail Feathers (Spread fan with autumn bands)
      const tailFeathers = 9;
      const tailColors = [PALETTE.deepBrown, PALETTE.cranberry, PALETTE.pumpkin, PALETTE.mustard, PALETTE.warmCream];
      for (let i = -4; i <= 4; i++) {
        ctx.save();
        ctx.translate(-26, -14);
        const tailAngle = (i * 11 * Math.PI) / 180 + (turkey.isGrounded ? legCycle * 0.08 : 0);
        ctx.rotate(tailAngle);

        // Feather Base
        ctx.fillStyle = tailColors[Math.abs(i) % 3];
        ctx.beginPath();
        ctx.ellipse(-28, 0, 36, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#271915';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Mustard band
        ctx.fillStyle = PALETTE.mustard;
        ctx.beginPath();
        ctx.ellipse(-42, 0, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cream tip
        ctx.fillStyle = PALETTE.warmCream;
        ctx.beginPath();
        ctx.ellipse(-54, 0, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feather spine quill
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-60, 0);
        ctx.stroke();

        ctx.restore();
      }

      // 2. Thick Running Drumstick Legs
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';

      // Left leg
      ctx.beginPath();
      ctx.moveTo(-12, 22);
      const lFootX = -12 + (turkey.isGrounded ? legCycle * 22 : -16);
      const lFootY = 48 + (turkey.isGrounded ? Math.max(0, -legCycle * 10) : 0);
      ctx.lineTo(lFootX, lFootY);
      ctx.lineTo(lFootX + 16, lFootY);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(12, 22);
      const rFootX = 12 - (turkey.isGrounded ? legCycle * 22 : -10);
      const rFootY = 48 + (turkey.isGrounded ? Math.max(0, legCycle * 10) : 6);
      ctx.lineTo(rFootX, rFootY);
      ctx.lineTo(rFootX + 16, rFootY);
      ctx.stroke();

      // 3. Plump Body (Rich Warm Brown with plumage gradient)
      const bodyGrad = ctx.createRadialGradient(4, 4, 6, 0, 6, 42);
      bodyGrad.addColorStop(0, '#8D5B4C');
      bodyGrad.addColorStop(0.65, '#5D4037');
      bodyGrad.addColorStop(1, '#3E2723');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(2, 6, 38, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Layered breast feathers texture
      ctx.fillStyle = '#A0522D';
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          ctx.arc(8 + c * 8, 6 + r * 7, 6, 0, Math.PI);
          ctx.fill();
        }
      }

      // 4. Head & Slender Neck
      ctx.fillStyle = '#795548';
      ctx.beginPath();
      ctx.ellipse(24, -22, 16, 22, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 5. Red Snood & Wattle (Drooping down over beak)
      ctx.fillStyle = PALETTE.cranberryBright;
      const snoodWobble = Math.sin(turkey.animTimer * 24) * 4;
      ctx.beginPath();
      ctx.moveTo(34, -20);
      ctx.quadraticCurveTo(46, -10 + snoodWobble, 38, 6 + snoodWobble);
      ctx.quadraticCurveTo(30, 0 + snoodWobble, 30, -16);
      ctx.fill();
      ctx.strokeStyle = '#78281F';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 6. Yellow Beak
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(32, -28);
      ctx.lineTo(52, -22);
      ctx.lineTo(32, -15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 7. Expressive Googly Cartoon Eyes (Worried / Alert)
      // Left eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(22, -28, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#11141B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(32, -27, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupils looking nervously back towards farmer!
      const pupilShift = turkey.isGrounded ? -2 : 0;
      ctx.fillStyle = '#11141B';
      ctx.beginPath();
      ctx.arc(20 + pupilShift, -27, 4.5, 0, Math.PI * 2);
      ctx.arc(30 + pupilShift, -26, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(19 + pupilShift, -29, 2, 0, Math.PI * 2);
      ctx.arc(29 + pupilShift, -28, 2, 0, Math.PI * 2);
      ctx.fill();

      // Worried eyebrows
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(16, -37);
      ctx.lineTo(26, -34);
      ctx.moveTo(28, -34);
      ctx.lineTo(38, -36);
      ctx.stroke();

      // 8. Wings (Flapping dynamically)
      ctx.save();
      ctx.translate(-4, 6);
      const wingFlap = turkey.isGrounded ? 0.15 : Math.sin(turkey.animTimer * 38) * 0.9;
      ctx.rotate(wingFlap);

      ctx.fillStyle = '#4E342E';
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 15, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.pumpkin;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Wing feathers
      ctx.strokeStyle = PALETTE.mustard;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, 4);
      ctx.lineTo(16, 4);
      ctx.stroke();
      ctx.restore();

      // 9. Runaway Bandana (Red ribbon flapping behind)
      ctx.fillStyle = PALETTE.cranberryBright;
      ctx.beginPath();
      ctx.arc(22, -12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(16, -12);
      ctx.lineTo(-6, -20 + Math.sin(turkey.animTimer * 20) * 6);
      ctx.lineTo(-4, -6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    },

    drawTurkeySliding(turkey) {
      ctx.save();

      // 1. Full Fanned Tail Feathers (Tucked & Streaming Behind in Autumn Bands)
      const tailColors = [PALETTE.deepBrown, PALETTE.cranberry, PALETTE.pumpkin, PALETTE.mustard, PALETTE.warmCream];
      for (let i = -3; i <= 3; i++) {
        ctx.save();
        ctx.translate(-26, 4);
        const tailAngle = (i * 7 * Math.PI) / 180 - 0.12; // fanned streaming back
        ctx.rotate(tailAngle);

        // Feather Base
        ctx.fillStyle = tailColors[Math.abs(i) % 3];
        ctx.beginPath();
        ctx.ellipse(-30, 0, 32, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#271915';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Mustard band
        ctx.fillStyle = PALETTE.mustard;
        ctx.beginPath();
        ctx.ellipse(-42, 0, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cream tip
        ctx.fillStyle = PALETTE.warmCream;
        ctx.beginPath();
        ctx.ellipse(-52, 0, 7, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feather spine quill
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-56, 0);
        ctx.stroke();

        ctx.restore();
      }

      // 2. Plump Flattened Body (Rich Plumage Gradient)
      const bodyGrad = ctx.createRadialGradient(8, 4, 6, 0, 8, 45);
      bodyGrad.addColorStop(0, '#8D5B4C');
      bodyGrad.addColorStop(0.65, '#5D4037');
      bodyGrad.addColorStop(1, '#3E2723');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(4, 6, 52, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Breast feather scallops
      ctx.fillStyle = '#A0522D';
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          ctx.arc(14 + c * 9, 4 + r * 7, 6, 0, Math.PI);
          ctx.fill();
        }
      }

      // 3. Tucked Wing along body
      ctx.fillStyle = '#4E342E';
      ctx.beginPath();
      ctx.ellipse(-4, 6, 28, 12, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.pumpkin;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Wing feathers trim
      ctx.strokeStyle = PALETTE.mustard;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, 6);
      ctx.lineTo(16, 6);
      ctx.stroke();

      // 4. Outstretched Head & Neck
      ctx.fillStyle = '#795548';
      ctx.beginPath();
      ctx.ellipse(46, -6, 17, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 5. Red Snood & Wattle (Blown back by speed)
      ctx.fillStyle = PALETTE.cranberryBright;
      ctx.beginPath();
      ctx.moveTo(56, -6);
      ctx.quadraticCurveTo(68, 4, 48, 14);
      ctx.quadraticCurveTo(42, 4, 52, -4);
      ctx.fill();
      ctx.strokeStyle = '#78281F';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 6. Yellow Beak pointing straight forward
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(56, -12);
      ctx.lineTo(78, -5);
      ctx.lineTo(56, 1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 7. BIG Expressive Googly Eye (Worried & Focused!)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(46, -11, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#11141B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pupil looking forward/up
      ctx.fillStyle = '#11141B';
      ctx.beginPath();
      ctx.arc(48, -11, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(47, -13, 2, 0, Math.PI * 2);
      ctx.fill();

      // Focused cartoon eyebrow
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(38, -19);
      ctx.lineTo(52, -17);
      ctx.stroke();

      // 8. Runaway Red Bandana
      ctx.fillStyle = PALETTE.cranberryBright;
      ctx.beginPath();
      ctx.arc(36, 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(34, 1);
      ctx.lineTo(12, -7);
      ctx.lineTo(15, 6);
      ctx.closePath();
      ctx.fill();

      // 9. Billowing Slide Dust Puffs under and behind
      ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
      ctx.beginPath();
      ctx.arc(-42, 18, 12, 0, Math.PI * 2);
      ctx.arc(-62, 14, 15, 0, Math.PI * 2);
      ctx.arc(-80, 8, 10, 0, Math.PI * 2);
      ctx.arc(-20, 20, 9, 0, Math.PI * 2);
      ctx.fill();

      // Speed slide lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-75, 4);
      ctx.lineTo(-120, 4);
      ctx.moveTo(-65, 16);
      ctx.lineTo(-105, 16);
      ctx.stroke();

      ctx.restore();
    },

    drawTurkeyHiding(turkey) {
      // Hidden posture: body tucked in cover, only big googly eyes & tail tip peeking out!
      ctx.save();
      // Peeking tail feather tips
      ctx.fillStyle = PALETTE.pumpkin;
      ctx.beginPath();
      ctx.ellipse(-25, -20, 12, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.mustard;
      ctx.beginPath();
      ctx.ellipse(-20, -25, 12, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Big worried googly eyes peeking out
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(8, -15, 11, 0, Math.PI * 2);
      ctx.arc(26, -15, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#11141B';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Shifty pupils looking around
      ctx.fillStyle = '#11141B';
      ctx.beginPath();
      ctx.arc(10, -14, 5, 0, Math.PI * 2);
      ctx.arc(28, -14, 5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(9, -16, 2, 0, Math.PI * 2);
      ctx.arc(27, -16, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    // ==========================================
    // PROCEDURAL FARMER BARNABY BASTE
    // ==========================================
    drawFarmer(farmer, activeStage) {
      ctx.save();
      ctx.translate(farmer.x + farmer.width / 2, farmer.y + farmer.height / 2);

      const legSwing = Math.sin(farmer.animTimer * 26);
      const armSwing = Math.cos(farmer.animTimer * 26);

      // 1. Search Beam Cone (Barn & Kitchen stages)
      const hasBeam = activeStage && (activeStage.theme === 'barn' || activeStage.theme === 'kitchen');
      if (hasBeam) {
        ctx.save();
        ctx.translate(42, -20);
        const beamAngle = Math.sin(farmer.searchBeamAngle || 0) * 0.28;
        ctx.rotate(beamAngle);

        // Wide outer luminous cone
        const beamGrad = ctx.createRadialGradient(0, 0, 10, FARMER.searchBeamRange, 0, FARMER.searchBeamRange * 0.65);
        beamGrad.addColorStop(0, 'rgba(255, 245, 157, 0.85)');
        beamGrad.addColorStop(0.35, 'rgba(255, 235, 59, 0.45)');
        beamGrad.addColorStop(0.7, 'rgba(255, 214, 0, 0.22)');
        beamGrad.addColorStop(1, 'rgba(255, 214, 0, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(FARMER.searchBeamRange, -95);
        ctx.lineTo(FARMER.searchBeamRange, 95);
        ctx.closePath();
        ctx.fill();

        // Bright inner core beam
        const coreGrad = ctx.createLinearGradient(0, 0, FARMER.searchBeamRange * 0.75, 0);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        coreGrad.addColorStop(0.4, 'rgba(255, 245, 157, 0.4)');
        coreGrad.addColorStop(1, 'rgba(255, 245, 157, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(FARMER.searchBeamRange * 0.75, -40);
        ctx.lineTo(FARMER.searchBeamRange * 0.75, 40);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 2. Heavy Work Boots & Legs
      ctx.strokeStyle = '#1E3A8A'; // Blue denim overalls legs
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';

      // Left leg
      ctx.beginPath();
      ctx.moveTo(-18, 18);
      const fLeftX = -18 + legSwing * 26;
      const fLeftY = 56 + Math.max(0, -legSwing * 12);
      ctx.lineTo(fLeftX, fLeftY);
      ctx.stroke();

      // Left boot
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(fLeftX - 8, fLeftY, 26, 12);

      // Right leg
      ctx.beginPath();
      ctx.moveTo(18, 18);
      const fRightX = 18 - legSwing * 26;
      const fRightY = 56 + Math.max(0, legSwing * 12);
      ctx.lineTo(fRightX, fRightY);
      ctx.stroke();

      // Right boot
      ctx.fillRect(fRightX - 8, fRightY, 26, 12);

      // 3. Big Belly & Denim Overalls
      // Red & Yellow Plaid Flannel Shirt
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(-30, -30, 60, 52);
      // Plaid lines
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-30, -15);
      ctx.lineTo(30, -15);
      ctx.moveTo(-30, 0);
      ctx.lineTo(30, 0);
      ctx.moveTo(-10, -30);
      ctx.lineTo(-10, 22);
      ctx.moveTo(10, -30);
      ctx.lineTo(10, 22);
      ctx.stroke();

      // Denim overalls body
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.roundRect(-28, -12, 56, 40, [6, 6, 10, 10]);
      ctx.fill();
      ctx.strokeStyle = '#1E40AF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Overalls straps & brass buckles
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(-24, -30, 10, 22);
      ctx.fillRect(14, -30, 10, 22);

      ctx.fillStyle = '#F59E0B'; // Brass buckles
      ctx.fillRect(-25, -14, 12, 8);
      ctx.fillRect(13, -14, 12, 8);

      // 4. Head & Face
      ctx.fillStyle = '#FFD1A4'; // Skin tone
      ctx.beginPath();
      ctx.arc(0, -42, 20, 0, Math.PI * 2);
      ctx.fill();

      // Bulbous Red Nose
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(12, -40, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Bushy White Beard & Mustache
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.arc(10, -32, 15, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -32, 13, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Comic Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(7, -46, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(9, -46, 3, 0, Math.PI * 2);
      ctx.fill();

      // Bushy determined eyebrows
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(2, -53);
      ctx.lineTo(15, -49);
      ctx.stroke();

      // 5. Straw Hat with Red Ribbon
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(0, -56, 34, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-20, -70, 40, 17);
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#DC2626'; // Red hat ribbon
      ctx.fillRect(-20, -59, 40, 5);

      // 6. Right Arm lunging forward holding Roasting Pan
      ctx.save();
      ctx.translate(22, -20);
      const armAngle = farmer.isCharging ? -0.85 + armSwing * 0.45 : -0.25 + armSwing * 0.35;
      ctx.rotate(armAngle);

      // Arm
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();

      // Shiny Roasting Pan
      ctx.fillStyle = '#94A3B8';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(26, -20, 44, 30, 5);
      ctx.fill();
      ctx.stroke();

      // Pan handle
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(20, -7, 8, 10);
      ctx.restore();

      // 7. Distraction Thought Bubble (Procedural, NO emoji)
      if (farmer.isDistracted) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(20, -110, 130, 36, 10);
        ctx.fill();
        ctx.stroke();

        // Little corn cob icon inside bubble
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.ellipse(40, -92, 6, 11, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16A34A';
        ctx.fillRect(36, -84, 8, 4);

        ctx.fillStyle = '#11141B';
        ctx.font = '900 13px Impact, "Arial Black", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('OOH, CORN!!', 54, -88);
      }

      ctx.restore();
    },

    // ==========================================
    // PROCEDURAL HAZARDS & OBSTACLES
    // ==========================================
    drawObstacle(obs) {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      if (obs.kind === HAZARDS.FENCE) {
        this.drawFence(obs);
      } else if (obs.kind === HAZARDS.MUD) {
        this.drawMud(obs);
      } else if (obs.kind === HAZARDS.HAYBALE) {
        this.drawHaybale(obs);
      } else if (obs.kind === HAZARDS.HIDING_SPOT) {
        this.drawHidingSpot(obs);
      } else if (obs.kind === HAZARDS.ROLLING_PIN) {
        this.drawRollingPin(obs);
      } else if (obs.kind === HAZARDS.CARVING_KNIFE) {
        this.drawCarvingKnife(obs);
      } else if (obs.kind === HAZARDS.OVEN) {
        this.drawOven(obs);
      }

      ctx.restore();
    },

    drawFence(obs) {
      ctx.fillStyle = '#8D5B4C';
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2.5;

      // Vertical fence posts
      ctx.fillRect(4, 0, 12, obs.height);
      ctx.strokeRect(4, 0, 12, obs.height);
      ctx.fillRect(obs.width - 16, 0, 12, obs.height);
      ctx.strokeRect(obs.width - 16, 0, 12, obs.height);

      // Horizontal split rails
      ctx.fillRect(0, 12, obs.width, 10);
      ctx.strokeRect(0, 12, obs.width, 10);
      ctx.fillRect(0, obs.height - 20, obs.width, 10);
      ctx.strokeRect(0, obs.height - 20, obs.width, 10);
    },

    drawMud(obs) {
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.ellipse(obs.width / 2, obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wet mud ripples & shine
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(obs.width / 2, obs.height / 2, obs.width * 0.38, obs.height * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(obs.width * 0.4, obs.height * 0.35, 8, 3, -0.2, 0, Math.PI * 2);
      ctx.fill();
    },

    drawHaybale(obs) {
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, obs.width, obs.height, 8);
      ctx.fill();
      ctx.stroke();

      // Straw texture lines
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      for (let s = 8; s < obs.height; s += 10) {
        ctx.beginPath();
        ctx.moveTo(6, s);
        ctx.lineTo(obs.width - 6, s);
        ctx.stroke();
      }
    },

    drawHidingSpot(obs) {
      if (obs.subKind === 'haystack') {
        // Round golden haystack
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(obs.width / 2, obs.height, obs.width / 2, Math.PI, 0, false);
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (obs.subKind === 'barrel') {
        // Wooden cellar barrel
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.roundRect(0, 0, obs.width, obs.height, 10);
        ctx.fill();
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Metal hoops
        ctx.fillStyle = '#4B5563';
        ctx.fillRect(0, 12, obs.width, 8);
        ctx.fillRect(0, obs.height - 20, obs.width, 8);
      } else {
        // Banquet Dining Table with draped autumn tablecloth
        ctx.fillStyle = PALETTE.cranberry;
        ctx.fillRect(0, 0, obs.width, 28);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(0, 28, obs.width, 5); // gold cloth fringe
        // Table legs
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(6, 33, 10, obs.height - 33);
        ctx.fillRect(obs.width - 16, 33, 10, obs.height - 33);
      }

      // Hide indicator prompt badge (NO EMOJI)
      ctx.fillStyle = 'rgba(26, 18, 11, 0.9)';
      ctx.strokeStyle = PALETTE.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(obs.width / 2 - 38, -28, 76, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[E] HIDE', obs.width / 2, -13);
    },

    drawRollingPin(obs) {
      ctx.save();
      ctx.translate(obs.width / 2, obs.height / 2);
      ctx.rotate(obs.rot || 0);

      // Wooden cylinder
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-22, -11, 44, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Handles
      ctx.fillStyle = '#78350F';
      ctx.fillRect(-32, -5, 10, 10);
      ctx.fillRect(22, -5, 10, 10);
      ctx.restore();
    },

    drawCarvingKnife(obs) {
      ctx.save();
      if (obs.flying) {
        ctx.translate(obs.width / 2, obs.height / 2);
        ctx.rotate(obs.rot || 0);

        // Curved speed swoosh lines and motion trail behind flying blade
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-35, -12);
        ctx.quadraticCurveTo(-65, -20, -95, -14);
        ctx.moveTo(-35, 10);
        ctx.quadraticCurveTo(-60, 22, -85, 20);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-75, 0);
        ctx.stroke();
        ctx.restore();
      } else if (obs.chopping) {
        ctx.translate(obs.width / 2, obs.height / 2 + (obs.yOffset || 0));

        // Downward vertical speed streaks
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-15, -48);
        ctx.lineTo(-15, -16);
        ctx.moveTo(8, -55);
        ctx.lineTo(8, -18);
        ctx.moveTo(25, -42);
        ctx.lineTo(25, -14);
        ctx.stroke();
        ctx.restore();

        // Wooden butcher cutting board base under the cleaver
        ctx.fillStyle = '#A16207';
        ctx.beginPath();
        ctx.roundRect(-45, 14, 90, 16, 4);
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cutting board end-grain lines
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-20, 14);
        ctx.lineTo(-20, 30);
        ctx.moveTo(15, 14);
        ctx.lineTo(15, 30);
        ctx.stroke();

        // Impact spark flash where blade meets board
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(20, 14, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gleaming Stainless Steel Knife Blade
      const bladeGrad = ctx.createLinearGradient(-30, 0, 20, 0);
      bladeGrad.addColorStop(0, '#E2E8F0');
      bladeGrad.addColorStop(0.5, '#FFFFFF');
      bladeGrad.addColorStop(1, '#94A3B8');

      ctx.fillStyle = bladeGrad;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-28, -10);
      ctx.lineTo(18, -10);
      ctx.quadraticCurveTo(34, -7, 36, 10); // razor sharp tip
      ctx.lineTo(-28, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Blade reflection shine line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-24, -4);
      ctx.lineTo(26, -4);
      ctx.stroke();

      // Rosewood handle with brass rivets
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(-34, -8, 16, 16);
      ctx.strokeStyle = '#271915';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-34, -8, 16, 16);

      ctx.fillStyle = '#F59E0B'; // Brass rivet
      ctx.beginPath();
      ctx.arc(-26, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    // ==========================================
    // THE ROASTING OVEN (BLASTING HEAT)
    // ==========================================
    drawOven(obs) {
      // 1. Heavy Metal Oven Body
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, obs.width, obs.height, 8);
      ctx.fill();
      ctx.stroke();

      // Stove burners on top with copper tea kettle
      ctx.fillStyle = '#334155';
      ctx.fillRect(8, -8, 24, 8);
      ctx.fillRect(obs.width - 32, -8, 24, 8);

      // Temperature Dials
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(18, 16, 6, 0, Math.PI * 2);
      ctx.arc(36, 16, 6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Oven Glass Door & Interior
      const doorX = 8;
      const doorY = 32;
      const doorW = obs.width - 16;
      const doorH = obs.height - 42;

      if (obs.isBlasting) {
        // OPEN DOOR WITH BLASTING BILLOWING FIRE!
        ctx.fillStyle = PALETTE.ovenHeat;
        ctx.fillRect(doorX, doorY, doorW, doorH);

        // Glowing red coils
        ctx.strokeStyle = '#FFDD00';
        ctx.lineWidth = 3.5;
        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          ctx.moveTo(doorX + 4, doorY + 12 + c * 15);
          ctx.lineTo(doorX + doorW - 4, doorY + 12 + c * 15);
          ctx.stroke();
        }

        // Billowing Fire Ball projecting to the left
        const flameGrad = ctx.createRadialGradient(-24, doorY + doorH / 2, 8, -42, doorY + doorH / 2, 65);
        flameGrad.addColorStop(0, '#FFFFFF');
        flameGrad.addColorStop(0.3, '#FFEB3B');
        flameGrad.addColorStop(0.7, '#FF5722');
        flameGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(-24, doorY + doorH / 2, 55, 0, Math.PI * 2);
        ctx.fill();

        // Swing open door drawn angled out
        ctx.fillStyle = '#334155';
        ctx.fillRect(-22, doorY, 22, doorH);
        ctx.strokeStyle = '#0F172A';
        ctx.strokeRect(-22, doorY, 22, doorH);
      } else {
        // CLOSED OVEN WITH GLOWING WINDOW
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(doorX, doorY, doorW, doorH);

        // Window warm glow
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.fillRect(doorX + 6, doorY + 6, doorW - 12, doorH - 12);

        // Silver door handle
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(doorX + 12, doorY + 4, doorW - 24, 8);
      }
    },

    // ==========================================
    // COLLECTIBLES & DECOYS
    // ==========================================
    drawCollectible(item) {
      ctx.save();
      ctx.translate(item.x + item.width / 2, item.y + (item.floatOffset || 0) + item.height / 2);

      if (item.kind === COLLECTIBLES.CORN) {
        // Golden Ear of Corn
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 16, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Green husk leaves
        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.ellipse(-5, 9, 6, 9, -0.4, 0, Math.PI * 2);
        ctx.ellipse(5, 9, 6, 9, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle glint
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-2, -5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.kind === COLLECTIBLES.GOLDEN_PUMPKIN) {
        // Shiny Golden Pumpkin
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.ellipse(-8, 0, 10, 16, -0.2, 0, Math.PI * 2);
        ctx.ellipse(8, 0, 10, 16, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Green curved stem
        ctx.fillStyle = '#15803D';
        ctx.fillRect(-3, -22, 6, 8);

        // Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(3, -6, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.kind === COLLECTIBLES.DECOY_BAG) {
        // Burlap bag of corn decoys
        ctx.fillStyle = '#A16207';
        ctx.beginPath();
        ctx.roundRect(-12, -10, 24, 24, 5);
        ctx.fill();
        ctx.strokeStyle = '#713F12';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(0, -8, 8, Math.PI, 0, false);
        ctx.fill();
      }

      ctx.restore();
    },

    drawDecoy(decoy) {
      ctx.save();
      ctx.translate(decoy.x, decoy.y);

      // Decoy corn cob on ground
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16A34A';
      ctx.fillRect(-10, -3, 8, 5);

      // Pulsing aura ring
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    },
  };
}
