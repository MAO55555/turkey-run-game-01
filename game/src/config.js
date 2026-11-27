// Configuration and constants for Gobbler's Great Getaway: The Thanksgiving Escape.
// Logical resolution is 1280x720 (16:9 widescreen), scaled with DPR crispness.

export const FIELD = {
  width: 1280,
  height: 720,
  groundY: 560,
};

export const STEP = 1 / 60;

export const TOTAL_DISTANCE = 1000; // meters to freedom

export const STAGES = [
  {
    id: 1,
    name: 'The Farmyard',
    subtitle: 'Run for your life past the hay & fences!',
    startMeters: 0,
    endMeters: 250,
    theme: 'farm',
    skyColor: '#9C3412',
    skyGradBottom: '#E67E22',
    groundColor: '#4A2C18',
    grassColor: '#6B8E23',
    iconType: 'grain',
  },
  {
    id: 2,
    name: 'The Old Barn',
    subtitle: 'Sneak through rafters & avoid the search beam!',
    startMeters: 250,
    endMeters: 500,
    theme: 'barn',
    skyColor: '#1A1423',
    skyGradBottom: '#3D1C24',
    groundColor: '#331F17',
    grassColor: '#6E4D3E',
    iconType: 'barn',
  },
  {
    id: 3,
    name: 'Porch & Pantry',
    subtitle: 'Slide under shelves & jump rolling pins!',
    startMeters: 500,
    endMeters: 750,
    theme: 'pantry',
    skyColor: '#2C3E50',
    skyGradBottom: '#4A3B32',
    groundColor: '#3E2723',
    grassColor: '#8D6E63',
    iconType: 'jar',
  },
  {
    id: 4,
    name: 'The Roasting Kitchen',
    subtitle: 'Dodge the blast ovens & flying carving knives!',
    startMeters: 750,
    endMeters: 1000,
    theme: 'kitchen',
    skyColor: '#1F1D2B',
    skyGradBottom: '#3B1F2B',
    groundColor: '#1A1D28',
    grassColor: '#4A5568',
    iconType: 'flame',
  },
];

export const PLAYER = {
  standWidth: 110,
  standHeight: 105,
  slideWidth: 135,
  slideHeight: 52,
  screenX: 450, // default turkey position relative to left screen
  runSpeed: 400, // pixels per second base world scroll
  maxSpeedBonus: 110,
  jumpSpeed: -670,
  gravity: 1700,
  doubleFlapImpulse: -440,
  maxFlaps: 2,
  slideDuration: 0.65,
  slideCooldown: 0.15,
  coyoteTime: 0.12,
  jumpBufferTime: 0.12,
  invincibleTime: 1.6,
  maxLives: 3,
  initialDecoys: 3,
  maxDecoys: 5,
};

export const FARMER = {
  name: 'Farmer Barnaby Baste',
  width: 105,
  height: 135,
  minGap: 0, // reached turkey -> CAUGHT
  maxGap: 420, // safe distance behind
  startingGap: 260,
  catchDistance: 65, // pixels
  baseClosingSpeed: 50, // px/s closed when turkey stumbles
  mudSlowPenalty: 95,
  hitStumblePenalty: 130,
  decoyDistractDuration: 2.8, // seconds farmer is stopped eating/picking decoy
  searchBeamRange: 380,
  searchBeamAngle: 36, // degrees
};

export const HAZARDS = {
  FENCE: 'fence',
  MUD: 'mud',
  HAYBALE: 'haybale',
  ROLLING_PIN: 'rolling_pin',
  CARVING_KNIFE: 'carving_knife',
  OVEN: 'oven',
  HIDING_SPOT: 'hiding_spot',
};

export const COLLECTIBLES = {
  CORN: 'corn',
  GOLDEN_PUMPKIN: 'golden_pumpkin',
  DECOY_BAG: 'decoy_bag',
};

export const SCORES = {
  CORN: 50,
  GOLDEN_PUMPKIN: 250,
  CLOSE_SHAVE: 150,
  STAGE_CLEAR: 500,
  METERS_RUN: 1, // per meter
  ESCAPE_BONUS: 2000,
};

export const PALETTE = {
  pumpkin: '#E66B1A',
  pumpkinLight: '#FF8C38',
  pumpkinDark: '#B34A00',
  cranberry: '#9E2A2B',
  cranberryBright: '#C83E40',
  mustard: '#E9B44C',
  mustardLight: '#F5C869',
  deepBrown: '#3E2723',
  mediumBrown: '#5D4037',
  warmWood: '#8D5B4C',
  warmCream: '#FFF3E0',
  softCream: '#FFE0B2',
  duskTeal: '#1F363D',
  duskTealDark: '#132226',
  barnRed: '#9C2A2C',
  forestGreen: '#2D5A27',
  gold: '#FAD02C',
  knifeSteel: '#E2E8F0',
  knifeGleam: '#FFFFFF',
  ovenDark: '#2D3748',
  ovenHeat: '#FF4500',
  ovenGlow: '#FFA500',
  hudBg: 'rgba(26, 18, 11, 0.90)',
  hudBorder: '#E9B44C',
};

export const STORAGE_KEYS = {
  BEST_SCORE: 'gobblers_escape_best_score',
  BEST_METERS: 'gobblers_escape_best_meters',
  AUDIO_MUTED: 'gobblers_escape_muted',
};
