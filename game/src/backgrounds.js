// Modular background rendering engine for Gobbler's Great Getaway.
// Rich multi-layer parallax for Farmyard, Barn, Pantry, and Kitchen.
// Clean architectural anchors, warm lighting pools, and shaded perspective flooring.

import { FIELD, PALETTE } from './config.js';

export function createBackgrounds() {
  return {
    // ==========================================
    // 1. FARMYARD PARALLAX BACKGROUND
    // Layered autumn hills, anchored red barn & silo,
    // corn rows, hay bales, falling leaves, textured dirt.
    // ==========================================
    drawFarmyard(ctx, width, groundY, scrollX) {
      // Golden Harvest Moon (upper right)
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(1080, 115, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 224, 130, 0.2)';
      ctx.beginPath();
      ctx.arc(1080, 115, 80, 0, Math.PI * 2);
      ctx.fill();

      // Layer 1: Distant Purple-Maroon Hills (0.08x parallax)
      const farScroll = scrollX * 0.08;
      ctx.fillStyle = '#4A1515';
      for (let i = 0; i < 5; i++) {
        const hx = ((i * 380 - farScroll) % (width + 380)) - 190;
        ctx.beginPath();
        ctx.arc(hx + 190, groundY + 60, 260, Math.PI, 0, false);
        ctx.fill();

        // Small silhouetted tree clumps on far ridges
        ctx.fillStyle = '#3B1010';
        for (let t = -3; t <= 3; t++) {
          ctx.beginPath();
          ctx.arc(hx + 190 + t * 24, groundY - 170 + Math.abs(t) * 10, 12, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#4A1515';
      }

      // Layer 2: Mid Hills with Colorful Autumn Foliage (0.18x parallax)
      const midScroll = scrollX * 0.18;
      ctx.fillStyle = '#7C2D12';
      for (let i = 0; i < 6; i++) {
        const mx = ((i * 300 - midScroll) % (width + 300)) - 150;
        ctx.beginPath();
        ctx.arc(mx + 150, groundY + 40, 190, Math.PI, 0, false);
        ctx.fill();

        // Colorful canopy trees on mid hills (rust, gold, orange)
        const treeColors = ['#C2410C', '#EA580C', '#EAB308', '#CA8A04', '#B91C1C'];
        for (let tc = 0; tc < 3; tc++) {
          const tx = mx + 90 + tc * 55;
          const ty = groundY - 110 - Math.sin((tc / 2) * Math.PI) * 20;

          // Tree trunk
          ctx.fillStyle = '#451A03';
          ctx.fillRect(tx - 3, ty, 6, 35);

          // Canopy puff
          ctx.fillStyle = treeColors[(i + tc) % treeColors.length];
          ctx.beginPath();
          ctx.arc(tx, ty - 4, 20, 0, Math.PI * 2);
          ctx.arc(tx - 12, ty + 4, 15, 0, Math.PI * 2);
          ctx.arc(tx + 12, ty + 4, 15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#7C2D12';
      }

      // Layer 3: Anchored Red Barn and Silver Silo (0.32x parallax)
      const barnScroll = scrollX * 0.32;
      for (let b = 0; b < 2; b++) {
        const bx = ((b * 800 + 380 - barnScroll) % (width + 600)) - 250;

        // Concrete / Stone foundation anchored to groundY
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx - 46, groundY - 12, 230, 12);

        // Silver Metal Silo (sitting firmly on ground footing)
        const siloW = 44;
        const siloH = 200;
        const siloX = bx - 42;
        const siloY = groundY - siloH;

        // Silo body with metallic horizontal gradient
        const siloGrad = ctx.createLinearGradient(siloX, 0, siloX + siloW, 0);
        siloGrad.addColorStop(0, '#64748B');
        siloGrad.addColorStop(0.35, '#CBD5E1');
        siloGrad.addColorStop(0.7, '#94A3B8');
        siloGrad.addColorStop(1, '#475569');
        ctx.fillStyle = siloGrad;
        ctx.fillRect(siloX, siloY, siloW, siloH);

        // Silo Dome Top
        ctx.beginPath();
        ctx.arc(siloX + siloW / 2, siloY, siloW / 2, Math.PI, 0, false);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Silo metal hoops
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 2;
        for (let h = siloY + 24; h < groundY - 12; h += 28) {
          ctx.beginPath();
          ctx.moveTo(siloX, h);
          ctx.lineTo(siloX + siloW, h);
          ctx.stroke();
        }

        // Red Barn Body (Anchored directly to groundY)
        const barnW = 160;
        const barnH = 170;
        const barnY = groundY - barnH;

        ctx.fillStyle = '#991B1B';
        ctx.fillRect(bx, barnY, barnW, barnH);

        // Vertical wood plank lines
        ctx.strokeStyle = '#7F1D1D';
        ctx.lineWidth = 1.5;
        for (let p = bx + 16; p < bx + barnW; p += 16) {
          ctx.beginPath();
          ctx.moveTo(p, barnY);
          ctx.lineTo(p, groundY - 12);
          ctx.stroke();
        }

        // Gambrel Dutch Barn Roof
        ctx.fillStyle = '#450A0A';
        ctx.beginPath();
        ctx.moveTo(bx - 12, barnY);
        ctx.lineTo(bx + 30, barnY - 45);
        ctx.lineTo(bx + barnW / 2, barnY - 60);
        ctx.lineTo(bx + barnW - 30, barnY - 45);
        ctx.lineTo(bx + barnW + 12, barnY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Double sliding barn doors with white X-trim
        const doorW = 56;
        const doorH = 75;
        const doorX = bx + 52;
        const doorY = groundY - doorH;

        ctx.fillStyle = '#450A0A';
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(doorX, doorY, doorW, doorH);

        // X braces on doors
        ctx.beginPath();
        ctx.moveTo(doorX, doorY);
        ctx.lineTo(doorX + doorW / 2, doorY + doorH);
        ctx.moveTo(doorX + doorW / 2, doorY);
        ctx.lineTo(doorX, doorY + doorH);
        ctx.moveTo(doorX + doorW / 2, doorY);
        ctx.lineTo(doorX + doorW, doorY + doorH);
        ctx.moveTo(doorX + doorW, doorY);
        ctx.lineTo(doorX + doorW / 2, doorY + doorH);
        ctx.stroke();

        // Hayloft door with golden hay peeking out
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(bx + barnW / 2, barnY + 45, 18, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#450A0A';
        ctx.strokeRect(bx + barnW / 2 - 16, barnY + 20, 32, 30);
      }

      // Layer 4: Wooden Fences, Corn Stalks & Hay Bales (0.45x parallax)
      const nearScroll = scrollX * 0.45;

      // Connecting split rail fence
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 3.5;
      for (let f = 0; f < width + 240; f += 90) {
        const fx = ((f - nearScroll) % (width + 240)) - 100;
        // Post
        ctx.beginPath();
        ctx.moveTo(fx, groundY);
        ctx.lineTo(fx, groundY - 45);
        ctx.stroke();
        // Rails
        ctx.beginPath();
        ctx.moveTo(fx - 45, groundY - 32);
        ctx.lineTo(fx + 45, groundY - 32);
        ctx.moveTo(fx - 45, groundY - 16);
        ctx.lineTo(fx + 45, groundY - 16);
        ctx.stroke();
      }

      // Golden Round Hay Bales resting on ground
      for (let h = 0; h < 2; h++) {
        const hx = ((h * 650 + 200 - nearScroll) % (width + 400)) - 150;
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.roundRect(hx, groundY - 42, 60, 42, 8);
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Straw spirals
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hx + 18, groundY - 21, 12, 0, Math.PI * 2);
        ctx.arc(hx + 18, groundY - 21, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Corn Rows with ears of corn
      for (let c = 0; c < 10; c++) {
        const cx = ((c * 150 + 80 - nearScroll) % (width + 200)) - 60;
        ctx.strokeStyle = '#4D7C0F';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, groundY);
        ctx.lineTo(cx, groundY - 95);
        ctx.stroke();

        // Leaves
        ctx.strokeStyle = '#65A30D';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, groundY - 45);
        ctx.quadraticCurveTo(cx - 20, groundY - 65, cx - 24, groundY - 45);
        ctx.moveTo(cx, groundY - 70);
        ctx.quadraticCurveTo(cx + 20, groundY - 85, cx + 24, groundY - 65);
        ctx.stroke();

        // Golden cob
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.ellipse(cx + 6, groundY - 55, 6, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Falling Autumn Leaves drifting
      const leafColors = ['#DC2626', '#EA580C', '#F59E0B', '#B45309'];
      for (let l = 0; l < 18; l++) {
        const lx = ((l * 80 + Math.sin(l * 3.2 + scrollX * 0.005) * 50 - scrollX * 0.6) % (width + 100));
        const ly = 120 + ((l * 37 + scrollX * 0.3) % (groundY - 140));
        ctx.fillStyle = leafColors[l % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(lx, ly, 7, 4, (l * 0.6) + Math.sin(scrollX * 0.01 + l), 0, Math.PI * 2);
        ctx.fill();
      }
    },

    // ==========================================
    // 2. KITCHEN PARALLAX BACKGROUND
    // Ceiling lamps with light pools, subway tiles,
    // upper wall cabinets, window, wall clock,
    // hanging copper pots, counters, sink, cutting board,
    // and true perspective shaded checkered floor.
    // ==========================================
    drawKitchen(ctx, width, groundY, scrollX) {
      // Wall Base: Warm Slate
      ctx.fillStyle = '#26212B';
      ctx.fillRect(0, 0, width, groundY);

      // Subway Tile Backsplash (above counter, below cabinets)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      const tileH = 20;
      const tileW = 44;
      for (let ty = 140; ty < groundY - 120; ty += tileH) {
        ctx.beginPath();
        ctx.moveTo(0, ty);
        ctx.lineTo(width, ty);
        ctx.stroke();

        const offset = (Math.floor(ty / tileH) % 2) * (tileW / 2);
        for (let tx = offset; tx < width; tx += tileW) {
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx, ty + tileH);
          ctx.stroke();
        }
      }

      // Warm Overhead Ceiling Pendant Lamps & Light Pools
      const lamps = [220, 560, 960];
      for (let lx of lamps) {
        // Cord & brass lamp fixture
        ctx.strokeStyle = '#1E1B24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, 70);
        ctx.stroke();

        // Brass pendant shade
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.moveTo(lx - 26, 85);
        ctx.lineTo(lx + 26, 85);
        ctx.lineTo(lx + 14, 70);
        ctx.lineTo(lx - 14, 70);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Light bulb
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(lx, 86, 6, 0, Math.PI * 2);
        ctx.fill();

        // Radiant Warm Light Pool descending down the wall and counter
        const lightGrad = ctx.createRadialGradient(lx, 95, 10, lx, 260, 240);
        lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
        lightGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.10)');
        lightGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.moveTo(lx - 15, 88);
        ctx.lineTo(lx + 15, 88);
        ctx.lineTo(lx + 220, groundY);
        ctx.lineTo(lx - 220, groundY);
        ctx.closePath();
        ctx.fill();
      }

      // Upper Wall Cabinets with Panel Moldings
      ctx.fillStyle = '#18151D';
      ctx.fillRect(0, 0, width, 130);
      ctx.fillStyle = '#221D28';
      ctx.fillRect(0, 126, width, 5); // bottom cabinet molding

      for (let c = 0; c < width; c += 150) {
        ctx.strokeStyle = '#383242';
        ctx.lineWidth = 2;
        ctx.strokeRect(c + 4, 8, 142, 112);
        ctx.strokeStyle = '#2D2835';
        ctx.strokeRect(c + 14, 18, 122, 92); // inner panel molding

        // Brass handle knob (only where clear of HUD panels)
        if (c > 270 && c < width - 280) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(c + 130, 68, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Arched Kitchen Window overlooking dusk autumn trees
      const winX = 350;
      const winY = 150;
      const winW = 160;
      const winH = 135;

      // Sunset view through window
      const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      winGrad.addColorStop(0, '#B91C1C');
      winGrad.addColorStop(0.5, '#EA580C');
      winGrad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, winH, [70, 70, 0, 0]);
      ctx.fill();

      // Silhouetted branches outside
      ctx.strokeStyle = '#3B1510';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(winX + 25, winY + winH);
      ctx.lineTo(winX + 60, winY + 60);
      ctx.lineTo(winX + 90, winY + 40);
      ctx.moveTo(winX + 60, winY + 60);
      ctx.lineTo(winX + 45, winY + 30);
      ctx.stroke();

      // White Window Frame & Panes
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX, winY + winH / 2);
      ctx.lineTo(winX + winW, winY + winH / 2);
      ctx.stroke();

      // Analog Wall Clock (Centered, below HUD at y = 175)
      const clockX = 640;
      const clockY = 175;
      const clockR = 26;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B45309'; // brass rim
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Clock hour ticks & hands
      ctx.fillStyle = '#1E293B';
      for (let h = 0; h < 12; h++) {
        const ha = (h * Math.PI) / 6;
        ctx.fillRect(clockX + Math.sin(ha) * 20 - 1, clockY - Math.cos(ha) * 20 - 1, 2, 2);
      }
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + 11, clockY - 11); // minute hand
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX - 8, clockY - 6); // hour hand
      ctx.stroke();

      // Hanging Pot Rack with Polished Copper Cookware (0.2x parallax)
      const kScroll = scrollX * 0.2;
      const potRackX = 740;
      const potRackY = 145;

      // Iron suspension bar
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(potRackX - 100, potRackY);
      ctx.lineTo(potRackX + 120, potRackY);
      ctx.stroke();

      const pots = [
        { dx: -70, r: 18, handle: 16 },
        { dx: -20, r: 24, handle: 20 },
        { dx: 35, r: 16, handle: 14 },
        { dx: 85, r: 22, handle: 18 },
      ];

      for (let pot of pots) {
        const px = potRackX + pot.dx;
        const py = potRackY + 36;

        // Hanging S-hook
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, potRackY);
        ctx.lineTo(px, py - pot.r);
        ctx.stroke();

        // Polished Copper Pot Body
        const copGrad = ctx.createRadialGradient(px - 5, py - 5, 2, px, py, pot.r);
        copGrad.addColorStop(0, '#FB923C');
        copGrad.addColorStop(0.6, '#C2410C');
        copGrad.addColorStop(1, '#9A3412');
        ctx.fillStyle = copGrad;
        ctx.beginPath();
        ctx.arc(px, py, pot.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#EA580C';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pot side handle
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(px + pot.r - 2, py - 4, pot.handle, 8);
      }

      // Stainless Steel Kitchen Counters with Cabinets Below (y = groundY - 120 to groundY)
      const counterTopY = groundY - 120;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, counterTopY, width, 120);

      // Polished stainless counter top edge with bevel shine
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, counterTopY - 6, width, 8);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(0, counterTopY + 2, width, 3);

      // Counter drawers & handles
      for (let d = 30; d < width; d += 180) {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(d, counterTopY + 12, 160, 45);
        ctx.strokeRect(d, counterTopY + 62, 160, 48);
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(d + 65, counterTopY + 28, 30, 5);
        ctx.fillRect(d + 65, counterTopY + 80, 30, 5);
      }

      // Stainless Steel Sink with Gooseneck Faucet
      const sinkX = 220;
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(sinkX, counterTopY - 4, 90, 8);
      ctx.fillStyle = '#334155';
      ctx.fillRect(sinkX + 6, counterTopY, 78, 6);

      // Chrome faucet
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sinkX + 45, counterTopY - 4);
      ctx.lineTo(sinkX + 45, counterTopY - 32);
      ctx.arc(sinkX + 35, counterTopY - 32, 10, 0, Math.PI, true);
      ctx.stroke();

      // Wooden Butcher Cutting Board on Counter with Knife Block
      for (let b = 0; b < 3; b++) {
        const bx = ((b * 420 + 120 - kScroll) % (width + 300)) - 120;
        // End-grain cutting board
        ctx.fillStyle = '#A16207';
        ctx.beginPath();
        ctx.roundRect(bx, counterTopY - 16, 75, 14, 3);
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wooden Knife Block holding knife handles
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.roundRect(bx + 90, counterTopY - 44, 34, 40, 4);
        ctx.fill();
        // Slanted knife handles
        ctx.fillStyle = '#271915';
        ctx.fillRect(bx + 94, counterTopY - 58, 6, 16);
        ctx.fillRect(bx + 104, counterTopY - 54, 6, 12);
        ctx.fillRect(bx + 114, counterTopY - 50, 6, 8);
      }
    },

    // ==========================================
    // 3. BARN & PANTRY BACKGROUNDS
    // ==========================================
    drawBarn(ctx, width, groundY, scrollX) {
      // Dark timber wall
      ctx.fillStyle = '#271813';
      ctx.fillRect(0, 0, width, groundY);

      // Heavy timber posts and cross beams
      const bScroll = scrollX * 0.25;
      for (let b = 0; b < width + 300; b += 220) {
        const bx = ((b - bScroll) % (width + 300)) - 100;
        ctx.fillStyle = '#3E241A';
        ctx.fillRect(bx, 0, 24, groundY);
        ctx.fillStyle = '#1B0E0A';
        ctx.fillRect(bx + 20, 0, 4, groundY);
      }

      // Overhead rafters
      ctx.fillStyle = '#331D14';
      ctx.fillRect(0, 90, width, 22);
      ctx.fillRect(0, 190, width, 18);

      // Hanging Brass Lanterns with warm radial light pools
      for (let l = 0; l < 4; l++) {
        const lx = ((l * 320 + 140 - bScroll) % (width + 200)) - 80;
        // Chain
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, 110);
        ctx.lineTo(lx, 150);
        ctx.stroke();

        // Lantern frame
        ctx.fillStyle = '#D97706';
        ctx.fillRect(lx - 12, 150, 24, 30);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(lx - 8, 155, 16, 20);

        // Warm radial light pool
        const lGrad = ctx.createRadialGradient(lx, 165, 8, lx, 220, 140);
        lGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        lGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.18)');
        lGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = lGrad;
        ctx.beginPath();
        ctx.arc(lx, 165, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Upper hayloft with straw overhang
      ctx.fillStyle = '#4A2A1D';
      ctx.fillRect(0, 0, width, 75);
      ctx.fillStyle = '#D97706';
      for (let s = 0; s < width; s += 20) {
        ctx.fillRect(s, 72, 14, 10 + (s % 7) * 2);
      }
    },

    drawPantry(ctx, width, groundY, scrollX) {
      // Warm wallpaper
      ctx.fillStyle = '#2C221E';
      ctx.fillRect(0, 0, width, groundY);

      // Porch / Pantry posts
      const pScroll = scrollX * 0.35;
      for (let p = 0; p < width + 250; p += 260) {
        const px = ((p - pScroll) % (width + 250)) - 80;
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(px, 0, 20, groundY);
      }

      // Pantry Shelves with Colorful Canning Jars
      for (let row = 1; row <= 2; row++) {
        const sy = 180 + row * 115;
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, sy, width, 14);

        for (let j = 0; j < 10; j++) {
          const jx = ((j * 150 + row * 40 - pScroll) % (width + 200)) - 80;
          const jarColors = ['#DC2626', '#F59E0B', '#16A34A', '#9333EA'];
          ctx.fillStyle = jarColors[j % jarColors.length];
          ctx.beginPath();
          ctx.roundRect(jx, sy - 34, 24, 34, 4);
          ctx.fill();
          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(jx + 2, sy - 40, 20, 6);
        }
      }

      // Hanging Garlic braids & dried herbs
      for (let h = 0; h < 6; h++) {
        const hx = ((h * 220 - pScroll * 0.7) % (width + 200)) - 60;
        ctx.strokeStyle = '#A16207';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(hx, 0);
        ctx.lineTo(hx, 65);
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        for (let g = 0; g < 4; g++) {
          ctx.beginPath();
          ctx.arc(hx + (g % 2 === 0 ? -4 : 4), 32 + g * 11, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    // ==========================================
    // 4. DETAILED GROUND & FOREGROUND PROPS
    // Checkered floor with perspective & shading for kitchen;
    // Layered grass, textured dirt, pebbles, pumpkins for farm.
    // ==========================================
    drawGround(ctx, width, height, groundY, scrollX, theme) {
      if (theme === 'kitchen') {
        // True Perspective Checkered Floor (converging to vanishing point, shrinking towards counter, darker towards bottom)
        const totalH = height - groundY;
        const vpX = width / 2; // 640
        const vpY = groundY - 140; // 430
        const distBottom = height - vpY; // 290
        const rows = 8;
        const colWBottom = 68;
        const offset = ((scrollX * 0.45) % colWBottom + colWBottom) % colWBottom;

        // Draw quadrilateral tiles row by row from back to front
        for (let r = 0; r < rows; r++) {
          const t1 = Math.pow(r / rows, 1.8);
          const t2 = Math.pow((r + 1) / rows, 1.8);
          const y1 = groundY + t1 * totalH;
          const y2 = groundY + t2 * totalH;

          const ratio1 = (y1 - vpY) / distBottom;
          const ratio2 = (y2 - vpY) / distBottom;

          // Muted warm tile colours: cream and terracotta
          const creamColor = r % 2 === 0 ? '#EFE4D6' : '#E8DDD0';
          const terracottaColor = r % 2 === 0 ? '#965545' : '#88493B';

          // Span from offscreen-left to offscreen-right
          const minCol = Math.floor((-vpX) / (colWBottom * ratio2)) - 2;
          const maxCol = Math.ceil((width - vpX) / (colWBottom * ratio2)) + 2;

          for (let c = minCol; c <= maxCol; c++) {
            const isCream = ((c + r) % 2 + 2) % 2 === 0;
            ctx.fillStyle = isCream ? creamColor : terracottaColor;

            const x1L = vpX + (c * colWBottom - offset) * ratio1;
            const x1R = vpX + ((c + 1) * colWBottom - offset) * ratio1;
            const x2R = vpX + ((c + 1) * colWBottom - offset) * ratio2;
            const x2L = vpX + (c * colWBottom - offset) * ratio2;

            ctx.beginPath();
            ctx.moveTo(x1L, y1);
            ctx.lineTo(x1R, y1);
            ctx.lineTo(x2R, y2);
            ctx.lineTo(x2L, y2);
            ctx.closePath();
            ctx.fill();

            // Subtle grout line between tiles
            ctx.strokeStyle = 'rgba(60, 30, 20, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Darkening gradient overlay toward the bottom edge
        const floorDarken = ctx.createLinearGradient(0, groundY, 0, height);
        floorDarken.addColorStop(0, 'rgba(25, 12, 8, 0.02)');
        floorDarken.addColorStop(0.45, 'rgba(25, 12, 8, 0.25)');
        floorDarken.addColorStop(1, 'rgba(15, 6, 4, 0.62)');
        ctx.fillStyle = floorDarken;
        ctx.fillRect(0, groundY, width, totalH);

        // Soft warm reflections of the 3 ceiling lamp pools on the floor
        for (let lx of [220, 560, 960]) {
          const lampGlow = ctx.createRadialGradient(lx, groundY + 45, 10, lx, groundY + 55, 140);
          lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
          lampGlow.addColorStop(0.45, 'rgba(245, 158, 11, 0.10)');
          lampGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = lampGlow;
          ctx.beginPath();
          ctx.ellipse(lx, groundY + 55, 140, 48, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Top Floor Kickplate / Molding
        ctx.fillStyle = '#452015';
        ctx.fillRect(0, groundY, width, 5);
        ctx.fillStyle = '#B45309';
        ctx.fillRect(0, groundY, width, 2);
      } else if (theme === 'farm') {
        // Natural Dirt Path with rich dark earth texture
        const dirtGrad = ctx.createLinearGradient(0, groundY, 0, height);
        dirtGrad.addColorStop(0, '#26150F');
        dirtGrad.addColorStop(0.4, '#1C0E0A');
        dirtGrad.addColorStop(1, '#120805');
        ctx.fillStyle = dirtGrad;
        ctx.fillRect(0, groundY, width, height - groundY);

        // Lush Darker Foreground Grass Strip
        ctx.fillStyle = '#2E5A0E';
        ctx.fillRect(0, groundY, width, 14);
        ctx.fillStyle = '#3F7A14';
        ctx.fillRect(0, groundY, width, 6);

        // Detailed individual grass blades
        ctx.fillStyle = '#65A30D';
        for (let i = 0; i < 70; i++) {
          const gx = ((i * 22 - scrollX) % width + width) % width;
          ctx.beginPath();
          ctx.moveTo(gx, groundY);
          ctx.lineTo(gx + 3, groundY - 12 - (i % 5) * 2);
          ctx.lineTo(gx + 6, groundY);
          ctx.fill();
        }

        // River pebbles & rock textures
        ctx.fillStyle = '#3D251D';
        for (let p = 0; p < 30; p++) {
          const px = ((p * 45 - scrollX * 0.9) % width + width) % width;
          const py = groundY + 22 + (p * 9) % 115;
          ctx.beginPath();
          ctx.ellipse(px, py, 6 + (p % 4), 3.5, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.beginPath();
          ctx.ellipse(px - 1, py - 1, 3, 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#3D251D';
        }

        // Small Mud / Rain puddles reflecting dusk sky
        for (let pu = 0; pu < 3; pu++) {
          const pux = ((pu * 420 + 160 - scrollX * 0.9) % width + width) % width;
          const puy = groundY + 50 + pu * 35;
          ctx.fillStyle = '#1A0E0B';
          ctx.beginPath();
          ctx.ellipse(pux, puy, 34, 10, -0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(234, 88, 12, 0.2)'; // sky reflection
          ctx.beginPath();
          ctx.ellipse(pux, puy - 1, 26, 6, -0.05, 0, Math.PI * 2);
          ctx.fill();
        }

        // Orange Harvest Pumpkins growing in foreground vines
        for (let pk = 0; pk < 4; pk++) {
          const pkx = ((pk * 360 + 220 - scrollX) % width + width) % width;
          const pky = groundY + 55 + (pk % 3) * 32;

          // Pumpkin shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(pkx, pky + 14, 18, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pumpkin body
          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.ellipse(pkx - 7, pky, 10, 14, -0.15, 0, Math.PI * 2);
          ctx.ellipse(pkx + 7, pky, 10, 14, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#F97316';
          ctx.beginPath();
          ctx.ellipse(pkx, pky, 11, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          // Green curved stem
          ctx.fillStyle = '#15803D';
          ctx.fillRect(pkx - 2, pky - 19, 4, 6);
        }

        // Fallen autumn leaves on ground
        const groundLeaves = ['#DC2626', '#EA580C', '#D97706', '#991B1B'];
        for (let l = 0; l < 24; l++) {
          const lx = ((l * 65 - scrollX) % width + width) % width;
          const ly = groundY + 20 + (l * 11) % 120;
          ctx.fillStyle = groundLeaves[l % groundLeaves.length];
          ctx.beginPath();
          ctx.ellipse(lx, ly, 7, 3.5, 0.4 * l, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Barn / Pantry Rustic Wood Floorboards
        ctx.fillStyle = '#3E241A';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#2A1710';
        ctx.fillRect(0, groundY, width, 6);

        for (let b = groundY + 24; b < height; b += 28) {
          ctx.strokeStyle = '#1B0E0A';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, b);
          ctx.lineTo(width, b);
          ctx.stroke();

          // Nail heads
          ctx.fillStyle = '#5D3A2C';
          for (let n = 20; n < width; n += 120) {
            const nx = ((n - scrollX) % width + width) % width;
            ctx.beginPath();
            ctx.arc(nx, b - 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    },

    // ==========================================
    // 5. FREEDOM WOODS EXIT PORTAL (At 1000m)
    // ==========================================
    drawFreedomDoor(ctx, exitX, groundY) {
      ctx.save();
      // Radiant golden light beam pouring from open door
      const doorGlow = ctx.createRadialGradient(exitX + 85, groundY - 130, 15, exitX + 85, groundY - 130, 280);
      doorGlow.addColorStop(0, '#FEF08A');
      doorGlow.addColorStop(0.35, '#F59E0B');
      doorGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = doorGlow;
      ctx.fillRect(exitX - 60, groundY - 280, 320, 280);

      // Open Kitchen Screen Door & Frame
      ctx.fillStyle = '#451A03';
      ctx.fillRect(exitX, groundY - 250, 26, 250);
      ctx.fillRect(exitX, groundY - 250, 170, 26);
      ctx.fillRect(exitX + 150, groundY - 250, 24, 250);

      // Outdoor Freedom Woods view
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.arc(exitX + 85, groundY - 80, 55, 0, Math.PI * 2);
      ctx.fill();

      // Sign: "FREEDOM WOODS"
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.roundRect(exitX + 18, groundY - 220, 120, 32, 6);
      ctx.fill();
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#451A03';
      ctx.font = '900 12px Impact, "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FREEDOM WOODS', exitX + 78, groundY - 198);

      ctx.restore();
    },
  };
}
