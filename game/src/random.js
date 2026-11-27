// Seedable pseudo-random number generator (Mulberry32).
// Ensures deterministic simulation for screenshots and reproducible play.

export function createRandom(initialSeed = 1337) {
  let s = (Math.floor(initialSeed) >>> 0) || 1337;

  function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    range(min, max) {
      return min + next() * (max - min);
    },
    rangeInt(min, max) {
      return Math.floor(min + next() * (max - min + 1));
    },
    choice(items) {
      if (!items || items.length === 0) return null;
      return items[Math.floor(next() * items.length)];
    },
    chance(probability) {
      return next() < probability;
    },
    getSeed() {
      return s;
    },
  };
}
