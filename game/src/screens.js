// Screen layouts and UI rendering for Title, Caught (Stuffed & Served), Escaped, and Paused screens.
// Completely procedural: zero external images or emojis.
// Clean non-overlapping compositions with rich backgrounds and props.

import { FIELD, PALETTE, TOTAL_DISTANCE } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CAUGHT = 'caught';
export const SCREEN_ESCAPED = 'escaped';

export function createScreens() {
  const buttons = [];

  function addButton(id, x, y, width, height, text, primary = true) {
    buttons.push({ id, x, y, width, height, text, primary });
  }

  return {
    buttons,

    hitTest(mouseX, mouseY) {
      for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        if (mouseX >= b.x && mouseX <= b.x + b.width && mouseY >= b.y && mouseY <= b.y + b.height) {
          return b.id;
        }
      }
      return null;
    },

    clearButtons() {
      buttons.length = 0;
    },

    // ==========================================
    // TITLE SCREEN
    // ==========================================
    drawTitle(ctx, renderer, bestScore, bestMeters, isMuted) {
      this.clearButtons();

      // Warm Autumn Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, FIELD.height);
      grad.addColorStop(0, '#5C1D11');
      grad.addColorStop(0.35, '#993D13');
      grad.addColorStop(0.7, '#C2410C');
      grad.addColorStop(1, '#2E150F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);

      // Harvest Moon in upper right (clear of title text!)
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(1100, 110, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 224, 130, 0.2)';
      ctx.beginPath();
      ctx.arc(1100, 110, 85, 0, Math.PI * 2);
      ctx.fill();

      // Distant Silhouetted Hills & Trees
      ctx.fillStyle = '#451A13';
      ctx.beginPath();
      ctx.arc(200, FIELD.groundY + 40, 260, Math.PI, 0, false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(900, FIELD.groundY + 30, 280, Math.PI, 0, false);
      ctx.fill();

      // Lower Ground Scene (filling bottom ~25% with rich farmyard props & textures)
      // 1. Rich Earth Dirt Foundation
      const groundGrad = ctx.createLinearGradient(0, FIELD.groundY, 0, FIELD.height);
      groundGrad.addColorStop(0, '#2A1713');
      groundGrad.addColorStop(0.4, '#1C0E0A');
      groundGrad.addColorStop(1, '#120805');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, FIELD.groundY, FIELD.width, FIELD.height - FIELD.groundY);

      // 2. Wooden Split Rail Fence Posts and Cross Rails
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 3.5;
      for (let fx = 30; fx <= FIELD.width; fx += 110) {
        ctx.beginPath();
        ctx.moveTo(fx, FIELD.groundY + 6);
        ctx.lineTo(fx, FIELD.groundY - 42);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(fx - 55, FIELD.groundY - 30);
        ctx.lineTo(fx + 55, FIELD.groundY - 30);
        ctx.moveTo(fx - 55, FIELD.groundY - 14);
        ctx.lineTo(fx + 55, FIELD.groundY - 14);
        ctx.stroke();
      }

      // 3. Lush Autumn Grass Strip & Textured Blades
      ctx.fillStyle = '#2E5A0E';
      ctx.fillRect(0, FIELD.groundY, FIELD.width, 14);
      ctx.fillStyle = '#3F7A14';
      ctx.fillRect(0, FIELD.groundY, FIELD.width, 6);

      ctx.fillStyle = '#65A30D';
      for (let g = 0; g < FIELD.width; g += 16) {
        ctx.beginPath();
        ctx.moveTo(g, FIELD.groundY);
        ctx.lineTo(g + 3, FIELD.groundY - 11 - (g % 5) * 2);
        ctx.lineTo(g + 6, FIELD.groundY);
        ctx.fill();
      }

      // 4. River Stones and Autumn Leaves on Ground
      ctx.fillStyle = '#3D251D';
      for (let p = 0; p < 24; p++) {
        const px = (p * 55 + 20);
        const py = FIELD.groundY + 24 + (p * 9) % 110;
        ctx.beginPath();
        ctx.ellipse(px, py, 7, 4, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      const titleLeaves = ['#DC2626', '#EA580C', '#D97706', '#991B1B'];
      for (let l = 0; l < 20; l++) {
        ctx.fillStyle = titleLeaves[l % titleLeaves.length];
        ctx.beginPath();
        ctx.ellipse(l * 64 + 25, FIELD.groundY + 28 + (l * 13) % 110, 7, 3.5, l * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Golden Hay Bale on left (Decorative only, NO [E] HIDE prompt badge!)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.roundRect(50, FIELD.groundY - 48, 75, 48, 8);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(72, FIELD.groundY - 24, 14, 0, Math.PI * 2);
      ctx.arc(72, FIELD.groundY - 24, 7, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Orange Harvest Pumpkins growing in foreground grass
      const titlePumpkins = [150, 360, 840, 1190];
      for (let pk of titlePumpkins) {
        const pky = FIELD.groundY + 36;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(pk, pky + 14, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.ellipse(pk - 7, pky, 10, 14, -0.15, 0, Math.PI * 2);
        ctx.ellipse(pk + 7, pky, 10, 14, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.ellipse(pk, pky, 11, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#15803D';
        ctx.fillRect(pk - 2, pky - 19, 4, 6);
      }

      // Procedural Title Props & Character Staging
      // 1. Roasting Oven on far right blasting heat
      renderer.drawObstacle({ kind: 'oven', x: 1060, y: FIELD.groundY - 110, width: 100, height: 110, isBlasting: true });

      // 2. Flying Carving Knife slicing through air on right
      renderer.drawObstacle({ kind: 'carving_knife', flying: true, rot: 0.22, x: 920, y: FIELD.groundY - 100, width: 58, height: 25 });

      // 3. Farmer Barnaby Baste on the left lunging with roasting pan
      renderer.drawFarmer(
        {
          x: 210,
          y: FIELD.groundY - 150,
          width: 90,
          height: 120,
          animTimer: 0.2,
          searchBeamAngle: 0.1,
          isCharging: true,
          isDistracted: false,
        },
        { theme: 'farm' }
      );

      // 4. Hero Turkey Large (~1.5x) & Centered on the ground!
      renderer.drawTurkey({
        x: 570,
        y: FIELD.groundY - 118,
        width: 135,
        height: 128,
        isGrounded: true,
        isSliding: false,
        isHidden: false,
        animTimer: 0.5,
        squishScaleX: 1.35,
        squishScaleY: 1.35,
      });

      // 5. Collectibles
      renderer.drawCollectible({ kind: 'corn', x: 470, y: FIELD.groundY - 70, width: 24, height: 24 });
      renderer.drawCollectible({ kind: 'golden_pumpkin', x: 790, y: FIELD.groundY - 75, width: 32, height: 32 });

      // ==========================================
      // TITLE LOGO & TYPOGRAPHY
      // ==========================================
      ctx.save();
      ctx.textAlign = 'center';

      // Top Tagline Banner (NO EMOJI)
      ctx.fillStyle = PALETTE.gold;
      ctx.font = '900 16px Impact, "Arial Black", sans-serif';
      ctx.fillText('* THE ORIGINAL THANKSGIVING ESCAPE *', FIELD.width / 2, 45);

      // Main Game Title: "GOBBLER'S GREAT GETAWAY"
      ctx.font = '900 66px Impact, "Arial Black", sans-serif';
      // Deep 3D Drop Shadow
      ctx.fillStyle = '#1A0802';
      ctx.fillText("GOBBLER'S GREAT GETAWAY", FIELD.width / 2 + 5, 114);
      ctx.fillText("GOBBLER'S GREAT GETAWAY", FIELD.width / 2 + 3, 112);

      // Thick Cranberry Outline
      ctx.strokeStyle = PALETTE.cranberry;
      ctx.lineWidth = 8;
      ctx.strokeText("GOBBLER'S GREAT GETAWAY", FIELD.width / 2, 108);

      // Warm Golden Gradient Fill
      const titleGrad = ctx.createLinearGradient(0, 60, 0, 115);
      titleGrad.addColorStop(0, '#FFFBEB');
      titleGrad.addColorStop(0.35, '#FDE047');
      titleGrad.addColorStop(0.7, '#F59E0B');
      titleGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = titleGrad;
      ctx.fillText("GOBBLER'S GREAT GETAWAY", FIELD.width / 2, 108);

      // Subtitle
      ctx.fillStyle = '#FFF8E1';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('OUTRUN FARMER BASTE * DODGE THE OVEN * SLIDE UNDER THE CARVING KNIFE!', FIELD.width / 2, 146);

      // ==========================================
      // CONTROLS CARD (CENTER)
      // ==========================================
      const cardX = FIELD.width / 2 - 340;
      const cardY = 175;
      const cardW = 680;
      const cardH = 150;

      ctx.fillStyle = 'rgba(26, 18, 11, 0.94)';
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = PALETTE.gold;
      ctx.font = '900 15px Impact, "Arial Black", sans-serif';
      ctx.fillText('CONTROLS & SURVIVAL TACTICS', FIELD.width / 2, cardY + 24);

      // 4 Controls Columns (NO EMOJI)
      const controls = [
        { key: 'A / D or LEFT / RIGHT', act: 'RUN & ADJUST', badge: 'RUN' },
        { key: 'SPACE / W / UP', act: 'JUMP & FLAP (x2)', badge: 'JUMP' },
        { key: 'S / DOWN', act: 'DUCK & SLIDE', badge: 'SLIDE' },
        { key: 'E (HOLD)', act: 'HIDE IN COVER', badge: 'HIDE' },
      ];

      for (let c = 0; c < controls.length; c++) {
        const cx = cardX + 22 + c * 160;
        const cy = cardY + 38;

        ctx.fillStyle = '#2A1713';
        ctx.beginPath();
        ctx.roundRect(cx, cy, 145, 64, 8);
        ctx.fill();

        ctx.fillStyle = PALETTE.pumpkin;
        ctx.font = '900 11px Impact, "Arial Black", sans-serif';
        ctx.fillText(`[ ${controls[c].badge} ]`, cx + 72, cy + 18);

        ctx.fillStyle = PALETTE.gold;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(controls[c].key, cx + 72, cy + 36);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(controls[c].act, cx + 72, cy + 54);
      }

      // Mouse Decoy tip (NO EMOJI)
      ctx.fillStyle = '#81C784';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('MOUSE LEFT-CLICK: Toss Decoy Corn behind you to distract Farmer Barnaby Baste!', FIELD.width / 2, cardY + 130);

      // ==========================================
      // PLAY BUTTON & HIGH SCORE
      // ==========================================
      const btnW = 340;
      const btnH = 56;
      const btnX = (FIELD.width - btnW) / 2;
      const btnY = 338;

      ctx.shadowColor = PALETTE.gold;
      ctx.shadowBlur = 16;

      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
      btnGrad.addColorStop(0, '#48BB78');
      btnGrad.addColorStop(1, '#2F855A');
      ctx.fillStyle = btnGrad;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 28px Impact, "Arial Black", sans-serif';
      ctx.fillText('PLAY GAME [SPACE]', FIELD.width / 2, btnY + 39);

      addButton('play', btnX, btnY, btnW, btnH, 'PLAY GAME');

      // Best Score Card
      if (bestScore > 0) {
        ctx.fillStyle = PALETTE.gold;
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`BEST ESCAPE: ${bestScore.toLocaleString()} PTS (${bestMeters}m)`, FIELD.width / 2, 416);
      } else {
        ctx.fillStyle = PALETTE.warmCream;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Can you survive all 4 stages to reach the Freedom Woods?', FIELD.width / 2, 416);
      }

      // Sound toggle note (bottom margin, clear of characters)
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Press [M] to Toggle Sound: ${isMuted ? 'MUTED' : 'ON'}`, FIELD.width / 2, FIELD.height - 18);

      ctx.restore();
    },

    // ==========================================
    // CAUGHT SCREEN ("STUFFED & SERVED!")
    // Recomposed kitchen table banquet scene:
    // Dim kitchen wall with window overlooking dusk,
    // Farmer Barnaby Baste standing behind banquet table,
    // Patterned tablecloth with candle glow & feast props,
    // Large comic live turkey on silver platter,
    // Score card & Try Again button on right (ZERO OVERLAP).
    // ==========================================
    drawCaught(ctx, renderer, stats, bestScore) {
      this.clearButtons();

      const tableY = 370;

      // 1. Dim Kitchen Wall Background (y: 0 to tableY)
      const wallGrad = ctx.createLinearGradient(0, 0, 0, tableY);
      wallGrad.addColorStop(0, '#150A07');
      wallGrad.addColorStop(0.5, '#26130E');
      wallGrad.addColorStop(1, '#1A0C08');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);

      // Wooden ceiling beam
      ctx.fillStyle = '#100604';
      ctx.fillRect(0, 0, FIELD.width, 22);

      // Arched Kitchen Window overlooking dusk autumn trees (centered behind characters)
      const winX = 460;
      const winY = 38;
      const winW = 160;
      const winH = 135;

      // Sunset gradient through window
      const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      winGrad.addColorStop(0, '#7F1D1D');
      winGrad.addColorStop(0.5, '#C2410C');
      winGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, winH, [70, 70, 0, 0]);
      ctx.fill();

      // Crescent harvest moon outside window
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(winX + 115, winY + 38, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.arc(winX + 110, winY + 36, 14, 0, Math.PI * 2);
      ctx.fill();

      // Silhouetted branches outside
      ctx.strokeStyle = '#270F0A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(winX + 25, winY + winH);
      ctx.lineTo(winX + 65, winY + 60);
      ctx.lineTo(winX + 105, winY + 45);
      ctx.stroke();

      // Window white frame and cross mullions
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, winH, [70, 70, 0, 0]);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX, winY + winH / 2);
      ctx.lineTo(winX + winW, winY + winH / 2);
      ctx.stroke();

      // Background Oven on far left
      renderer.drawObstacle({
        kind: 'oven',
        x: 65,
        y: 195,
        width: 125,
        height: 135,
        isBlasting: false,
      });

      // 2. Gloating Farmer Barnaby Baste (Standing behind table, occluded by table edge)
      const farmerX = 540;
      const farmerY = 220;

      // Plaid Flannel Shirt Body
      ctx.fillStyle = '#B91C1C';
      ctx.beginPath();
      ctx.roundRect(farmerX - 48, farmerY + 18, 96, 130, [8, 8, 0, 0]);
      ctx.fill();

      // Yellow plaid lines
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(farmerX - 48, farmerY + 35);
      ctx.lineTo(farmerX + 48, farmerY + 35);
      ctx.moveTo(farmerX - 48, farmerY + 55);
      ctx.lineTo(farmerX + 48, farmerY + 55);
      ctx.moveTo(farmerX - 48, farmerY + 75);
      ctx.lineTo(farmerX + 48, farmerY + 75);
      ctx.moveTo(farmerX - 24, farmerY + 18);
      ctx.lineTo(farmerX - 24, farmerY + 150);
      ctx.moveTo(farmerX + 24, farmerY + 18);
      ctx.lineTo(farmerX + 24, farmerY + 150);
      ctx.stroke();

      // Denim Overalls (extending down behind table edge)
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.roundRect(farmerX - 40, farmerY + 44, 80, 110, [8, 8, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Overalls Straps & Brass Buckles
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(farmerX - 34, farmerY + 18, 15, 32);
      ctx.fillRect(farmerX + 19, farmerY + 18, 15, 32);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(farmerX - 35, farmerY + 44, 17, 9);
      ctx.fillRect(farmerX + 18, farmerY + 44, 17, 9);

      // White Napkin / Bib tucked in collar
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(farmerX - 26, farmerY + 18);
      ctx.lineTo(farmerX + 26, farmerY + 18);
      ctx.lineTo(farmerX, farmerY + 62);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Farmer Head & Face
      ctx.fillStyle = '#FFD1A4';
      ctx.beginPath();
      ctx.arc(farmerX, farmerY, 26, 0, Math.PI * 2);
      ctx.fill();

      // Straw Hat with Red Ribbon
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(farmerX, farmerY - 18, 44, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(farmerX - 26, farmerY - 38, 52, 22);
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(farmerX - 26, farmerY - 20, 52, 5);

      // Bulbous Red Nose & Cheeks
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(farmerX + 10, farmerY + 2, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Bushy White Beard
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.arc(farmerX + 8, farmerY + 16, 19, 0, Math.PI);
      ctx.arc(farmerX - 6, farmerY + 16, 16, 0, Math.PI);
      ctx.fill();

      // Grinning Mouth
      ctx.strokeStyle = '#991B1B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(farmerX + 8, farmerY + 6, 9, 0.1, Math.PI * 0.9);
      ctx.stroke();

      // Eyes (Joyful squint)
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(farmerX + 8, farmerY - 6, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(farmerX - 8, farmerY - 6, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Arms: Left arm holding Carving Fork angled in, Right arm holding Knife angled up
      // Left arm (flannel sleeve)
      ctx.save();
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(farmerX - 38, farmerY + 28);
      ctx.lineTo(farmerX - 62, farmerY + 25);
      ctx.lineTo(farmerX - 58, farmerY - 5);
      ctx.stroke();

      // Left hand
      ctx.fillStyle = '#FFD1A4';
      ctx.beginPath();
      ctx.arc(farmerX - 58, farmerY - 5, 9, 0, Math.PI * 2);
      ctx.fill();

      // Silver Carving Fork tilted inward toward platter
      ctx.translate(farmerX - 58, farmerY - 5);
      ctx.rotate(0.35);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(-3, -35, 6, 42); // handle
      ctx.fillRect(-7, -46, 4, 14); // tine 1
      ctx.fillRect(3, -46, 4, 14);  // tine 2
      ctx.restore();

      // Right arm (flannel sleeve)
      ctx.save();
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(farmerX + 38, farmerY + 28);
      ctx.lineTo(farmerX + 66, farmerY + 25);
      ctx.lineTo(farmerX + 62, farmerY - 8);
      ctx.stroke();

      // Right hand
      ctx.fillStyle = '#FFD1A4';
      ctx.beginPath();
      ctx.arc(farmerX + 62, farmerY - 8, 9, 0, Math.PI * 2);
      ctx.fill();

      // Carving Knife tilted dynamically with shine
      ctx.translate(farmerX + 62, farmerY - 8);
      ctx.rotate(-0.25);
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(-4, 0, 8, 20); // wooden handle
      // Gleaming steel blade
      ctx.fillStyle = '#E2E8F0';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-4, -50);
      ctx.quadraticCurveTo(8, -46, 12, -28);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glint highlight
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-1, -4);
      ctx.lineTo(-1, -44);
      ctx.stroke();
      ctx.restore();

      // 3. Banquet Table Surface (y: tableY to FIELD.height)
      // Linen tablecloth gradient
      const tableGrad = ctx.createLinearGradient(0, tableY, 0, FIELD.height);
      tableGrad.addColorStop(0, '#FFFBEB');
      tableGrad.addColorStop(0.3, '#FEF3C7');
      tableGrad.addColorStop(1, '#FDE68A');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, tableY, FIELD.width, FIELD.height - tableY);

      // Damask jacquard diamond weave pattern on tablecloth
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.10)';
      ctx.lineWidth = 1;
      for (let d = -FIELD.height; d < FIELD.width; d += 32) {
        ctx.beginPath();
        ctx.moveTo(d, tableY);
        ctx.lineTo(d + 400, tableY + 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(d + 400, tableY);
        ctx.lineTo(d, tableY + 400);
        ctx.stroke();
      }

      // Festive Autumn Tablecloth Runner
      ctx.fillStyle = PALETTE.cranberry;
      ctx.fillRect(0, tableY, FIELD.width, 32);
      ctx.fillStyle = PALETTE.gold;
      ctx.fillRect(0, tableY + 32, FIELD.width, 6);

      // Tablecloth Runner Pattern
      ctx.fillStyle = '#FFFDD0';
      for (let tx = 0; tx < FIELD.width; tx += 36) {
        ctx.fillRect(tx + 4, tableY + 6, 16, 20);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, tableY + 38, FIELD.width, 8);

      // 4. Table Banquet Feast Props
      // Silver Candelabra on far left
      const canX = 85;
      const canY = tableY + 60;
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(canX - 4, canY - 50, 8, 50);
      ctx.fillRect(canX - 25, canY - 30, 50, 6);
      ctx.fillRect(canX - 26, canY - 45, 6, 15);
      ctx.fillRect(canX + 20, canY - 45, 6, 15);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(canX - 25, canY - 65, 4, 20);
      ctx.fillRect(canX - 2, canY - 70, 4, 20);
      ctx.fillRect(canX + 21, canY - 65, 4, 20);

      // Radial candle glow spreading across the banquet table
      const candleTableGlow = ctx.createRadialGradient(canX, canY - 60, 15, canX + 200, canY + 100, 420);
      candleTableGlow.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      candleTableGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
      candleTableGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = candleTableGlow;
      ctx.fillRect(0, tableY, FIELD.width, FIELD.height - tableY);

      // Candle flames
      for (let fx of [canX - 23, canX, canX + 23]) {
        const fy = fx === canX ? canY - 76 : canY - 71;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Golden Gravy Boat with ladle at x = 165, y = 585
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.beginPath();
      ctx.ellipse(175, 595, 50, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(175, 582, 50, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#78350F';
      ctx.fillRect(195, 566, 32, 8);
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.ellipse(170, 580, 40, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Autumn Roast Veggies Platter at x = 430, y = 595
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(430, 606, 68, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.ellipse(430, 595, 68, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(405, 590, 12, 0, Math.PI * 2);
      ctx.arc(428, 594, 13, 0, Math.PI * 2);
      ctx.arc(450, 591, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(418, 582, 32, 8);
      ctx.fillRect(436, 576, 26, 7);

      // Large Pumpkin Pie with whipped cream swirl at x = 625, y = 590
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(625, 602, 60, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.ellipse(625, 592, 58, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.ellipse(625, 588, 50, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(625, 584, 10, 0, Math.PI * 2);
      ctx.fill();

      // Sparkling Cider Mug at x = 725, y = 555
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.beginPath();
      ctx.ellipse(735, 596, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(723, 545, 24, 45);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(725, 555, 20, 33);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(723, 545, 24, 10);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(751, 568, 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // 5. Silver Platter with Large Comic Live Turkey
      const platterX = 265;
      const platterY = 485;

      // Soft shadow under platter
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(platterX, platterY + 16, 165, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Large Polished Silver Platter
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.ellipse(platterX, platterY, 160, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Garnish parsley sprigs & red cranberries around platter rim
      for (let g = -5; g <= 5; g++) {
        const gx = platterX + g * 27;
        const gy = platterY + 14 - Math.abs(g) * 2.5;
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.arc(gx, gy, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(gx + 6, gy - 2, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live Turkey sitting bewildered in roasting platter (Large & Comic!)
      renderer.drawTurkey({
        x: platterX - 68,
        y: platterY - 115,
        width: 136,
        height: 125,
        isGrounded: true,
        isSliding: false,
        isHidden: false,
        animTimer: 0,
        squishScaleX: 1.35,
        squishScaleY: 1.15,
      });

      // Red Apple held gently in beak (comic, not gory!)
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(platterX + 54, platterY - 96, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#15803D';
      ctx.fillRect(platterX + 53, platterY - 111, 3, 5);

      // Butcher twine loosely tied criss-cross over turkey body
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(platterX - 35, platterY - 75);
      ctx.lineTo(platterX + 25, platterY - 50);
      ctx.moveTo(platterX - 30, platterY - 50);
      ctx.lineTo(platterX + 20, platterY - 75);
      ctx.stroke();

      // Comic sweat drops flying off turkey's head
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(platterX + 16, platterY - 140, 5, 0, Math.PI * 2);
      ctx.arc(platterX - 18, platterY - 132, 4, 0, Math.PI * 2);
      ctx.fill();

      // Comic dazed spinning stars above turkey
      const starColors = ['#FDE047', '#F59E0B', '#FDE047'];
      for (let s = -1; s <= 1; s++) {
        const sx = platterX + s * 30;
        const sy = platterY - 150 + Math.abs(s) * 8;
        ctx.fillStyle = starColors[s + 1];
        ctx.beginPath();
        ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx - 7, sy);
        ctx.lineTo(sx + 7, sy);
        ctx.moveTo(sx, sy - 7);
        ctx.lineTo(sx, sy + 7);
        ctx.stroke();
      }

      // 6. Top Banner: "STUFFED & SERVED!"
      ctx.textAlign = 'left';
      ctx.font = '900 52px Impact, "Arial Black", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText('STUFFED & SERVED!', 64, 74);
      ctx.strokeStyle = PALETTE.cranberry;
      ctx.lineWidth = 7;
      ctx.strokeText('STUFFED & SERVED!', 60, 70);
      ctx.fillStyle = '#FF5252';
      ctx.fillText('STUFFED & SERVED!', 60, 70);

      ctx.fillStyle = '#FFF8E1';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Farmer Barnaby Baste caught you!', 62, 105);
      ctx.fillText('Better luck on your next escape!', 62, 126);

      // 7. Right Side: Score Breakdown Card (ZERO OVERLAP!)
      const boxW = 410;
      const boxH = 340;
      const boxX = FIELD.width - boxW - 40;
      const boxY = 125;

      ctx.fillStyle = 'rgba(26, 18, 11, 0.95)';
      ctx.strokeStyle = PALETTE.hudBorder;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 12);
      ctx.fill();
      ctx.stroke();

      // Card Header
      ctx.textAlign = 'center';
      ctx.fillStyle = PALETTE.gold;
      ctx.font = '900 18px Impact, "Arial Black", sans-serif';
      ctx.fillText('FINAL ESCAPE SUMMARY', boxX + boxW / 2, boxY + 34);

      // Stat rows
      ctx.font = 'bold 15px sans-serif';
      const statYStart = boxY + 76;
      const statGap = 42;

      // Distance
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('DISTANCE RUN:', boxX + 24, statYStart);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.gold;
      ctx.fillText(`${Math.floor(stats.meters)}m (${stats.stageName || 'Stage'})`, boxX + boxW - 24, statYStart);

      // Corn & Pumpkins
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('CORN & PUMPKINS:', boxX + 24, statYStart + statGap);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.gold;
      ctx.fillText(`${stats.cornCount} collected`, boxX + boxW - 24, statYStart + statGap);

      // Close Shaves
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('CLOSE SHAVE DODGES:', boxX + 24, statYStart + statGap * 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.gold;
      ctx.fillText(`${stats.closeShaves} narrow escapes`, boxX + boxW - 24, statYStart + statGap * 2);

      // Divider line
      ctx.strokeStyle = '#4A3B32';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(boxX + 20, statYStart + statGap * 2.7);
      ctx.lineTo(boxX + boxW - 20, statYStart + statGap * 2.7);
      ctx.stroke();

      // Final Score
      ctx.textAlign = 'left';
      ctx.font = '900 24px Impact, "Arial Black", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('FINAL SCORE:', boxX + 24, statYStart + statGap * 3.6);

      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.pumpkinLight;
      ctx.font = '900 34px Impact, "Arial Black", sans-serif';
      ctx.fillText(stats.score.toLocaleString(), boxX + boxW - 24, statYStart + statGap * 3.6);

      // Record Badge
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = stats.score >= bestScore ? '#81C784' : '#B0BEC5';
      const bestText = stats.score >= bestScore ? '*** NEW PERSONAL BEST RECORD! ***' : `Personal Best: ${bestScore.toLocaleString()} pts`;
      ctx.fillText(bestText, boxX + boxW / 2, boxY + boxH - 16);

      // 8. Restart Button (Directly Below Score Card)
      const btnW = boxW;
      const btnH = 64;
      const btnX = boxX;
      const btnY = boxY + boxH + 20;

      ctx.shadowColor = PALETTE.pumpkin;
      ctx.shadowBlur = 16;

      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
      btnGrad.addColorStop(0, PALETTE.pumpkinLight);
      btnGrad.addColorStop(1, PALETTE.cranberry);
      ctx.fillStyle = btnGrad;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px Impact, "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRY AGAIN [SPACE / R]', btnX + btnW / 2, btnY + 42);

      addButton('restart', btnX, btnY, btnW, btnH, 'TRY AGAIN');

      ctx.restore();
    },

    // ==========================================
    // ESCAPED SCREEN ("SWEET FREEDOM!")
    // Turkey dashes into sunset woods,
    // Farmer Baste is comically stuck in screen door pet flap.
    // ==========================================
    drawEscaped(ctx, renderer, stats, bestScore) {
      this.clearButtons();

      // Golden Sunset Woods Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, FIELD.height);
      skyGrad.addColorStop(0, '#B91C1C');
      skyGrad.addColorStop(0.35, '#EA580C');
      skyGrad.addColorStop(0.7, '#F59E0B');
      skyGrad.addColorStop(1, '#2E7D32');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);

      ctx.save();
      ctx.textAlign = 'center';

      // Distant Freedom Woods Pine & Oak Trees
      ctx.fillStyle = '#166534';
      for (let t = 0; t < 14; t++) {
        ctx.beginPath();
        ctx.arc(t * 105, FIELD.groundY - 110, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ground (Lush Forest Turf)
      ctx.fillStyle = '#14532D';
      ctx.fillRect(0, FIELD.groundY, FIELD.width, FIELD.height - FIELD.groundY);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(0, FIELD.groundY, FIELD.width, 10);

      // Farmhouse Back Screen Door with Farmer stuck in pet flap on left!
      const doorX = 140;
      const doorY = FIELD.groundY - 190;
      ctx.fillStyle = '#451A03';
      ctx.fillRect(doorX, doorY, 130, 190);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(doorX + 8, doorY + 8, 114, 174);

      // Pet Flap opening
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(doorX + 25, doorY + 90, 80, 80);

      // Farmer Barnaby Baste comically stuck waist-deep in pet flap!
      ctx.fillStyle = '#2563EB'; // Blue overalls legs kicking outside
      ctx.fillRect(doorX + 35, doorY + 115, 18, 55);
      ctx.fillRect(doorX + 65, doorY + 110, 18, 60);
      ctx.fillStyle = '#3E2723'; // Boots
      ctx.fillRect(doorX + 30, doorY + 160, 24, 12);
      ctx.fillRect(doorX + 65, doorY + 160, 24, 12);

      // Comic thought bubble above door
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(doorX + 10, doorY - 45, 150, 34, 8);
      ctx.fill();
      ctx.fillStyle = '#11141B';
      ctx.font = '900 13px Impact, "Arial Black", sans-serif';
      ctx.fillText('CURSE THAT TURKEY!!', doorX + 85, doorY - 24);

      // Turkey dashing freely into Freedom Woods!
      renderer.drawTurkey({
        x: 560,
        y: FIELD.groundY - 110,
        width: 110,
        height: 105,
        isGrounded: true,
        isSliding: false,
        isHidden: false,
        animTimer: 0.8,
        squishScaleX: 1.0,
        squishScaleY: 1.0,
      });

      // Procedural Gold Ribbon Survivor Medal around neck
      ctx.fillStyle = '#2563EB'; // Blue ribbon
      ctx.beginPath();
      ctx.moveTo(595, FIELD.groundY - 70);
      ctx.lineTo(608, FIELD.groundY - 48);
      ctx.lineTo(602, FIELD.groundY - 70);
      ctx.fill();
      // Gold medal coin
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(608, FIELD.groundY - 44, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Top Banner: "SWEET FREEDOM!"
      ctx.font = '900 64px Impact, "Arial Black", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText('SWEET FREEDOM!', FIELD.width / 2 + 4, 84);
      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 8;
      ctx.strokeText('SWEET FREEDOM!', FIELD.width / 2, 80);
      ctx.fillStyle = PALETTE.gold;
      ctx.fillText('SWEET FREEDOM!', FIELD.width / 2, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('YOU ESCAPED THANKSGIVING DINNER! THE FREEDOM WOODS ARE YOURS!', FIELD.width / 2, 120);

      // Score Card
      const boxW = 460;
      const boxH = 175;
      const boxX = (FIELD.width - boxW) / 2;
      const boxY = 145;

      ctx.fillStyle = 'rgba(26, 18, 11, 0.94)';
      ctx.strokeStyle = PALETTE.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('ESCAPE BONUS:', boxX + 26, boxY + 42);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.gold;
      ctx.fillText('+2,000 PTS', boxX + boxW - 26, boxY + 42);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('FINAL SCORE:', boxX + 26, boxY + 90);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.pumpkinLight;
      ctx.font = '900 32px Impact, "Arial Black", sans-serif';
      ctx.fillText(stats.score.toLocaleString(), boxX + boxW - 26, boxY + 92);

      ctx.textAlign = 'center';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#81C784';
      ctx.fillText('RANK: LEGENDARY TURKEY SURVIVOR', FIELD.width / 2, boxY + 145);

      // Play Again Button
      const btnW = 320;
      const btnH = 60;
      const btnX = (FIELD.width - btnW) / 2;
      const btnY = 340;

      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
      btnGrad.addColorStop(0, '#48BB78');
      btnGrad.addColorStop(1, '#22543D');
      ctx.fillStyle = btnGrad;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px Impact, "Arial Black", sans-serif';
      ctx.fillText('RUN AGAIN [SPACE]', FIELD.width / 2, btnY + 40);

      addButton('restart', btnX, btnY, btnW, btnH, 'RUN AGAIN');

      ctx.restore();
    },

    // ==========================================
    // PAUSED OVERLAY
    // ==========================================
    drawPaused(ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(17, 20, 27, 0.78)';
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);

      ctx.textAlign = 'center';
      ctx.fillStyle = PALETTE.gold;
      ctx.font = '900 52px Impact, "Arial Black", sans-serif';
      ctx.fillText('GAME PAUSED', FIELD.width / 2, FIELD.height / 2 - 20);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Press [P] or [ESC] to Resume', FIELD.width / 2, FIELD.height / 2 + 30);
      ctx.restore();
    },
  };
}
