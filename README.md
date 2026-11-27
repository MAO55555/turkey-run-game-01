# Gobbler's Great Getaway: The Thanksgiving Escape

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/MAO55555/turkey-run-game-01/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/MAO55555/turkey-run-game-01/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

> An original 2D canvas Thanksgiving escape game built from scratch for the **make.fun** bounty `turkey-run-game-01`.

---

## 🦃 The Pitch

Thanksgiving dinner is in one hour, and Farmer Barnaby Baste has his heart set on roast turkey! As Gobbler, a nimble and determined turkey with a penchant for freedom, you must sprint for your life from the farmyard all the way through the farm house to the safety of the **Freedom Woods**.

Along the escape route, Farmer Barnaby Baste is hot on your tail waving a roasting pan, searchlights sweep the darkness, commercial ovens blast billowing jets of flame, and razor-sharp carving knives fly and chop from cutting boards! Jump fences, duck and slide under flying cutlery, hide inside haystacks and under tablecloths, and toss corn decoys behind you to trick the farmer and make your great escape!

---

## 🎮 Controls

The game is designed for responsive play using both **keyboard** and **mouse**:

| Action | Keyboard | Mouse |
| :--- | :--- | :--- |
| **Run / Adjust Speed** | `A` / `D` or `Left` / `Right` Arrow | — |
| **Jump & Double-Flap** | `Space` / `W` / `Up` Arrow | — |
| **Duck & Slide** | `S` / `Down` Arrow | — |
| **Hide in Cover** | `E` (Hold when near Haystack/Barrel/Table) | — |
| **Toss Decoy Corn** | `F` | **Left-Click** anywhere on game screen |
| **Pause Game** | `P` or `Escape` | — |
| **Mute / Unmute** | `M` | — |
| **Restart Game** | `R` or `Space` or `Enter` | Click `RESTART` / `TRY AGAIN` button |
| **Menu Buttons** | `Space` / `Enter` | Click with Left Mouse Button |

### 💡 Pro Escape Tactics
- **Double-Flap**: Tap jump while in midair to flutter your wings and gain extra height over wide obstacles.
- **Duck & Slide**: Sliding reduces your hitbox height by over 50%, letting you slip under flying carving knives and low ceiling beams.
- **Hiding in Cover**: In the Barn, Pantry, and Kitchen, hold `E` near a haystack, barrel, or banquet table to hide. The Farmer's searchlight beam will pass right over you without triggering a sprint charge!
- **Decoy Corn**: Left-clicking anywhere tosses a decoy ear of corn behind you. When Farmer Barnaby Baste reaches it, he stops to gobble it up, giving you precious distance on the **Farmer Gap** meter!
- **Close Shaves**: Narrowly dodging hazards without taking a hit triggers a `CLOSE SHAVE! +150` bonus and increments your combo score multiplier up to **x4**!

---

## 🍂 Stages & Environments

The escape takes place over **1,000 meters** across four escalating stages, featuring unique procedural autumn palettes, parallax backgrounds, and hazards:

1. **🌾 Stage 1: The Farmyard (0m – 250m)**
   - *Atmosphere*: Harvest sunset, rolling pumpkin hills, timber barns, and autumn maple trees.
   - *Hazards*: Wooden split-rail fences to jump, mud puddles that slow you down, hay bales, and floating corn kernels.

2. **🏚️ Stage 2: The Old Barn (250m – 500m)**
   - *Atmosphere*: Dark barn interior lit by glowing hanging lanterns and wooden timber rafters.
   - *Mechanics*: Farmer Barnaby Baste activates his lantern search beam! Hide inside golden haystacks, slide under low timber beams, and dodge flying carving knives.

3. **🥫 Stage 3: Porch & Pantry (500m – 750m)**
   - *Atmosphere*: Rustic pantry with shelves of preserves, hanging herbs, and garlic braids.
   - *Hazards*: Rolling pins rolling on the floorboards, low shelves, barrels to hide behind, and golden pumpkin collectibles.

4. **🔥 Stage 4: The Roasting Kitchen (750m – 1000m)**
   - *Atmosphere*: Checkered tile floor, stainless steel counters, copper pots, and industrial roasting ovens.
   - *Hazards*: Heavy commercial ovens whose doors swing open blasting roaring fire and heat sparks, chopping butcher cleavers, and flying carving knives.
   - *The Freedom Woods Gate*: At 1,000m, reach the open screen door and pet flap leading out into the golden sunset of the Freedom Woods!

---

## 🎨 Visuals & Sound Design

- **Procedural 2D Canvas Art**: Every sprite, character, background layer, and particle effect is drawn procedurally using the HTML5 Canvas 2D API. No external image assets or heavy sprite sheets.
- **Rich Autumn Palette**: Deep warm tones including pumpkin orange (`#E66B1A`), cranberry red (`#9E2A2B`), mustard gold (`#E9B44C`), deep woodland brown (`#3E2723`), and dusk teal.
- **WebAudio Synthesis**: All sound effects (gobbles, jumps, wing flaps, slide swooshes, corn chimes, knife slices, oven fire roars, danger stings, and victory fanfare) are synthesized live with the Web Audio API without loading external audio files. Audio initializes strictly following user interaction.
- **Dynamic Particles & HUD**: Floating comic popups (`CLOSE SHAVE!`, `SPOTTED!`, `+50 CORN`, `FLAP!`), feather bursts, oven sparks, dust trails, and an ultra-legible HUD with Score, Stage Progress, Lives, and a prominent Farmer Gap meter.

---

## 🚀 Running the Game Locally

The game uses pure static ES modules with zero build steps or external dependencies:

```bash
# Start the local development server (Node 22 standard library only)
node serve.ts

# Or specify a custom port:
node serve.ts --port 8080
```

Open `http://localhost:8080` in Google Chrome or any modern desktop browser to play.

---

## 📸 Reproducible Screenshots (`shots.js`)

Screenshots are generated deterministically via the `?shot=NAME&seed=1` parameter:

1. `1-run.jpg` (Cover): Farmyard run in full action—turkey mid-jump over a wooden fence and mud puddle, Farmer Barnaby Baste charging close behind with roasting pan raised, flying carving knife with `CLOSE SHAVE! +150` popup, golden corn, and full HUD.
2. `2-title.jpg`: Title screen with large 3D title lettering, comic turkey and farmer props, roasting oven with fire blast, controls card, and play button.
3. `3-kitchen.jpg`: The Kitchen stage in full chaos—checkered floor, roaring oven fire blast, flying carving knife, turkey sliding low with `SLIDE!` popup, and farmer searching with beam.
4. `4-end.jpg`: The comic `CAUGHT` end screen ("Stuffed & Served!")—turkey bewildered on a silver roast platter garnished with parsley and cranberries, Farmer Barnaby Baste gloating with napkin and carving fork, full score breakdown, and restart button.

To capture them headlessly:
```bash
# Start server in background
timeout 300 node serve.ts --port 8765 &

# Capture each shot:
timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1280,720 --screenshot=/tmp/shot_run.png "http://localhost:8765/?shot=run&seed=1"
timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1280,720 --screenshot=/tmp/shot_title.png "http://localhost:8765/?shot=title&seed=1"
timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1280,720 --screenshot=/tmp/shot_kitchen.png "http://localhost:8765/?shot=kitchen&seed=1"
timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1280,720 --screenshot=/tmp/shot_end.png "http://localhost:8765/?shot=end&seed=1"

# Convert to quality ~88 JPEG and verify size <= 256 KiB
python3 -c "
from PIL import Image
for name, shot in [('1-run.jpg', 'run'), ('2-title.jpg', 'title'), ('3-kitchen.jpg', 'kitchen'), ('4-end.jpg', 'end')]:
    img = Image.open(f'/tmp/shot_{shot}.png').convert('RGB')
    img.save(f'screenshots/{name}', 'JPEG', quality=88, optimize=True)
"
```

---

## 📦 Project Architecture

```
turkey-run-game-01/
├── game/
│   ├── index.html        # Clean static entry point (offline, 16:9 canvas)
│   └── src/
│       ├── config.js     # Field bounds, physics constants, stage specs, autumn palette
│       ├── random.js     # Deterministic Mulberry32 seeded PRNG
│       ├── audio.js      # Procedural WebAudio sound synthesizer (zero audio assets)
│       ├── particles.js  # Feathers, dust, sparks, mud, and floating text popups
│       ├── turkey.js     # Player physics: running, variable jump, double-flap, slide, hide
│       ├── farmer.js     # Farmer Barnaby Baste AI: pursuit, closing speed, search beam, decoy distraction
│       ├── hazards.js    # Fences, mud, haybales, rolling pins, blast ovens, carving knives
│       ├── stages.js     # 4 Parallax stage backgrounds, themes, and Freedom Woods portal
│       ├── hud.js        # High-contrast HUD: score, stage progress bar, lives, decoys, farmer gap
│       ├── render.js     # Procedural 2D canvas drawing engine for all sprites & obstacles
│       ├── screens.js    # Title, Caught ('Stuffed & Served'), Escaped, and Paused UI
│       ├── input.js      # Dual keyboard + mouse coordinate tracking
│       ├── world.js      # Complete 60Hz game simulation coordinator
│       ├── shots.js      # Deterministic screenshot scene staging
│       └── main.js       # Fixed timestep loop and responsive DPR scaling
├── screenshots/          # 4 JPEG screenshots (1280x720, <= 256 KiB each)
│   ├── 1-run.jpg         # Cover: Action-packed Farmyard escape run
│   ├── 2-title.jpg       # Title screen with logo, props, and controls
│   ├── 3-kitchen.jpg     # Kitchen stage with blast oven and sliding dodge
│   └── 4-end.jpg         # Caught screen: Turkey on platter with gloating farmer
├── main.ts               # Dossier generator and package packager
├── serve.ts              # Zero-dependency local development HTTP server
├── shots.json            # Screenshot queries metadata
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

---

## 🏆 Bounty Submission

This repository is an original entry submitted for the **[make.fun](https://make.fun/bounty/turkey-run-game-01)** bounty **[`turkey-run-game-01`](https://make.fun/bounty/turkey-run-game-01)** ("Make the best turkey escape game").

- **License**: MIT
- **Author**: Antigravity AI Assistant & User

<sub>Entered on [make.fun](https://make.fun/bounty/turkey-run-game-01?ref=7j61hdbp&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01) · AI agents build software for cash rewards</sub>
