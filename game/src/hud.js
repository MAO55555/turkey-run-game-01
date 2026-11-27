// High-contrast, crystal clear HUD for Gobbler's Great Getaway.
// Designed to be readable at full resolution and when shrunken to 768x480.
// Zero emojis: all icons, meters, and badges are drawn procedurally via canvas paths.

import { FARMER, FIELD, PALETTE, PLAYER, TOTAL_DISTANCE } from './config.js';

export function createHUD() {
  return {
    draw(ctx, state) {
      const {
        score,
        meters,
        turkey,
        farmer,
        currentStage,
        comboMultiplier,
        isMuted,
      } = state;

      ctx.save();

      // ==========================================
      // 1. TOP-LEFT: SCORE & COMBO BADGE
      // ==========================================
      ctx.fillStyle = PALETTE.hudBg;
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 3;

      // Score box
      this.drawRoundedRect(ctx, 24, 20, 240, 68, 10);
      ctx.fill();
      ctx.stroke();

      // Mini procedural pumpkin badge
      ctx.fillStyle = PALETTE.pumpkin;
      ctx.beginPath();
      ctx.ellipse(46, 54, 15, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#15803D';
      ctx.fillRect(44, 37, 5, 7);

      // Score text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE', 74, 42);

      ctx.fillStyle = PALETTE.gold;
      ctx.font = '900 28px Impact, "Arial Black", sans-serif';
      ctx.fillText(score.toLocaleString(), 74, 72);

      // Combo badge if > 1
      if (comboMultiplier > 1) {
        ctx.fillStyle = PALETTE.cranberryBright;
        this.drawRoundedRect(ctx, 185, 26, 72, 24, 6);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`x${comboMultiplier} COMBO`, 221, 42);
      }

      // ==========================================
      // 2. TOP-CENTER: PROGRESS & DISTANCE BAR
      // ==========================================
      const barWidth = 460;
      const barHeight = 44;
      const barX = (FIELD.width - barWidth) / 2;
      const barY = 20;

      // Background container
      ctx.fillStyle = PALETTE.hudBg;
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 3;
      this.drawRoundedRect(ctx, barX, barY, barWidth, barHeight + 24, 10);
      ctx.fill();
      ctx.stroke();

      // Stage Title
      ctx.fillStyle = PALETTE.warmCream;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentStage.name.toUpperCase()} (${Math.floor(meters)}m / ${TOTAL_DISTANCE}m)`, FIELD.width / 2, barY + 18);

      // Progress Track
      const trackX = barX + 16;
      const trackY = barY + 28;
      const trackWidth = barWidth - 36;
      const trackHeight = 16;

      ctx.fillStyle = '#11141B';
      this.drawRoundedRect(ctx, trackX, trackY, trackWidth, trackHeight, 8);
      ctx.fill();

      // Progress Fill
      const pct = Math.min(1.0, Math.max(0, meters / TOTAL_DISTANCE));
      const fillWidth = Math.max(12, trackWidth * pct);
      const progGrad = ctx.createLinearGradient(trackX, trackY, trackX + trackWidth, trackY);
      progGrad.addColorStop(0, PALETTE.pumpkin);
      progGrad.addColorStop(0.5, PALETTE.gold);
      progGrad.addColorStop(1, '#48BB78');
      ctx.fillStyle = progGrad;
      this.drawRoundedRect(ctx, trackX, trackY, fillWidth, trackHeight, 8);
      ctx.fill();

      // Stage Dividers with Roman numerals
      const stageLabels = ['I', 'II', 'III', 'IV'];
      for (let s = 1; s <= 3; s++) {
        const divX = trackX + (trackWidth * (s * 0.25));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(divX, trackY);
        ctx.lineTo(divX, trackY + trackHeight);
        ctx.stroke();
      }

      // Stage Section Labels above track
      ctx.font = '900 9px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      for (let s = 0; s < 4; s++) {
        const lblX = trackX + trackWidth * (s * 0.25 + 0.125);
        ctx.fillText(`STG ${stageLabels[s]}`, lblX, trackY - 2);
      }

      // Moving Turkey Marker on Track
      const turkeyMarkerX = trackX + trackWidth * pct;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(turkeyMarkerX, trackY + trackHeight / 2, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.pumpkin;
      ctx.beginPath();
      ctx.arc(turkeyMarkerX, trackY + trackHeight / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      // Mini beak
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(turkeyMarkerX + 4, trackY + trackHeight / 2 - 3);
      ctx.lineTo(turkeyMarkerX + 9, trackY + trackHeight / 2);
      ctx.lineTo(turkeyMarkerX + 4, trackY + trackHeight / 2 + 3);
      ctx.fill();

      // Procedural Freedom Pine Tree icon at track end
      const treeX = trackX + trackWidth + 10;
      const treeY = trackY + trackHeight / 2;
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.moveTo(treeX, treeY - 9);
      ctx.lineTo(treeX + 6, treeY + 4);
      ctx.lineTo(treeX - 6, treeY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#78350F';
      ctx.fillRect(treeX - 1.5, treeY + 4, 3, 4);

      // ==========================================
      // 3. TOP-RIGHT: LIVES & DECOY CORN
      // ==========================================
      const rightBoxWidth = 260;
      const rightBoxX = FIELD.width - rightBoxWidth - 24;

      ctx.fillStyle = PALETTE.hudBg;
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 3;
      this.drawRoundedRect(ctx, rightBoxX, 20, rightBoxWidth, 68, 10);
      ctx.fill();
      ctx.stroke();

      // Lives as golden drumsticks / feathers
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('LIVES', rightBoxX + 16, 40);

      for (let i = 0; i < PLAYER.maxLives; i++) {
        const heartX = rightBoxX + 65 + i * 28;
        const heartY = 34;
        if (i < turkey.lives) {
          // Full golden drumstick / heart
          ctx.fillStyle = PALETTE.gold;
          ctx.beginPath();
          ctx.arc(heartX, heartY, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = PALETTE.pumpkin;
          ctx.beginPath();
          ctx.arc(heartX, heartY, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Lost life
          ctx.fillStyle = '#555555';
          ctx.beginPath();
          ctx.arc(heartX, heartY, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Decoy corn ammo
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('DECOYS', rightBoxX + 16, 68);

      for (let d = 0; d < PLAYER.maxDecoys; d++) {
        const cornX = rightBoxX + 75 + d * 22;
        const cornY = 64;
        if (d < turkey.decoys) {
          ctx.fillStyle = '#FFD54F';
          ctx.beginPath();
          ctx.ellipse(cornX, cornY, 6, 9, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(cornX - 2, cornY + 5, 4, 5);
        } else {
          ctx.strokeStyle = '#666666';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(cornX, cornY, 5, 8, 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Small hint
      ctx.fillStyle = '#B0BEC5';
      ctx.font = 'italic 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('[CLICK] TOSS', rightBoxX + rightBoxWidth - 12, 68);

      // ==========================================
      // 4. UPPER-MID: PROMINENT FARMER GAP METER
      // ==========================================
      const gapBarWidth = 340;
      const gapBarHeight = 22;
      const gapX = (FIELD.width - gapBarWidth) / 2;
      const gapY = 96;

      ctx.fillStyle = PALETTE.hudBg;
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, gapX - 70, gapY - 4, gapBarWidth + 140, gapBarHeight + 8, 8);
      ctx.fill();
      ctx.stroke();

      // Farmer Label Left (Clean procedural badge)
      ctx.fillStyle = '#EF4444';
      ctx.font = '900 12px Impact, "Arial Black", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('FARMER', gapX - 10, gapY + 16);

      // Turkey Label Right
      ctx.fillStyle = PALETTE.gold;
      ctx.textAlign = 'left';
      ctx.fillText('TURKEY', gapX + gapBarWidth + 10, gapY + 16);

      // Inner Meter Track
      ctx.fillStyle = '#1A1412';
      this.drawRoundedRect(ctx, gapX, gapY, gapBarWidth, gapBarHeight, 6);
      ctx.fill();

      // Gap Ratio
      const gapRatio = Math.min(1.0, Math.max(0, (farmer.gap - FARMER.minGap) / (FARMER.maxGap - FARMER.minGap)));
      const fillGapW = Math.max(8, gapBarWidth * gapRatio);

      // Color coding: Green (safe) -> Yellow -> Red (Danger)
      let gapColor = '#48BB78';
      let gapText = 'SAFE GAP';
      if (gapRatio < 0.28) {
        gapColor = '#E53E3E';
        gapText = 'DANGER! FARMER ON YOUR TAIL!';
      } else if (gapRatio < 0.6) {
        gapColor = '#ECC94B';
        gapText = 'CLOSING IN!';
      }

      ctx.fillStyle = gapColor;
      this.drawRoundedRect(ctx, gapX, gapY, fillGapW, gapBarHeight, 6);
      ctx.fill();

      // Gap Status Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 12px Impact, "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(gapText, gapX + gapBarWidth / 2, gapY + 15);

      // ==========================================
      // 5. STATUS INDICATORS (HIDDEN / SPOTTED / MUTE)
      // ==========================================
      if (turkey.isHidden) {
        ctx.fillStyle = '#48BB78';
        this.drawRoundedRect(ctx, FIELD.width / 2 - 85, 134, 170, 30, 6);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HIDDEN IN COVER!', FIELD.width / 2, 154);
      }

      ctx.restore();
    },

    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
  };
}
