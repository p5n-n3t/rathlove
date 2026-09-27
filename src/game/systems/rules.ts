import { CHICKENS, DIFFICULTIES, GAMEPLAY } from "@/src/data/game-config";

export type Difficulty = keyof typeof DIFFICULTIES;
export type ChickenId = keyof typeof CHICKENS;
export type ShotKind = ChickenId | "cat";
export type ShotEvent = { type: "shot"; id: number; at: number; kind: ShotKind; pullX: number; pullY: number };
export type HitEvent = { type: "hit"; shotId: number; at: number; target: number | `bonus-${number}` };
export type RunEvent = ShotEvent | HitEvent;

const targets = ["alan", "bibi", "daniela", "epstein", "loomer", "shmuley", "trump"] as const;
const lanes = GAMEPLAY.lanes;

function hash(seed: number, index: number, salt: number) {
  let value = (seed ^ Math.imul(index + 1, 0x9e3779b1) ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function targetAt(seed: number, index: number, difficulty: Difficulty) {
  const settings = DIFFICULTIES[difficulty];
  const [slow, fast] = settings.targetSpeedRange;
  const [minDelay, maxDelay] = settings.spawnIntervalMs;
  let spawnAt = 900;
  for (let i = 0; i < index; i++) spawnAt += minDelay + hash(seed, i, 13) * (maxDelay - minDelay);
  const direction = hash(seed, index, 21) > 0.5 ? 1 : -1;
  return {
    id: index,
    spawnAt: Math.round(spawnAt),
    identity: targets[Math.floor(hash(seed, index, 31) * targets.length)],
    lane: Math.floor(hash(seed, index, 45) * lanes.length),
    speed: slow + Math.round(hash(seed, index, 57) * (fast - slow)),
    volatile: hash(seed, index, 79) > 0.72,
    direction,
  };
}

export function targetPosition(target: ReturnType<typeof targetAt>, at: number) {
  const lifetime = Math.max(0, (at - target.spawnAt) / 1000);
  const speed = target.speed * (at >= 75000 ? 1.1 : 1);
  return {
    x: target.direction === 1 ? -95 + lifetime * speed : 1695 - lifetime * speed,
    y: lanes[target.lane] + Math.sin(lifetime * (target.volatile ? 8 : 5) + target.id) * (target.volatile ? 15 : 7),
  };
}

export function bonusAt(seed: number, index: number, times: number[]) {
  return { at: times[index] * 1000, x: [430, 1160, 690, 1330][Math.floor(hash(seed, index, 93) * 4)], y: [265, 390, 515][Math.floor(hash(seed, index, 98) * 3)] };
}

export function projectilePosition(shot: ShotEvent, at: number) {
  const dt = (at - shot.at) / 1000;
  const length = Math.hypot(shot.pullX, shot.pullY);
  const unit = Math.min(1, length / 190);
  const speed = (750 + unit * 1100) * (shot.kind === "cat" ? 0.85 : CHICKENS[shot.kind].speedMultiplier);
  const nx = length ? -shot.pullX / length : 0;
  const ny = length ? -shot.pullY / length : -1;
  return { x: GAMEPLAY.slingshot.x + nx * speed * dt, y: GAMEPLAY.slingshot.y + ny * speed * dt + 340 * dt * dt };
}

export function calculateHitValue(target: ReturnType<typeof targetAt>, difficulty: Difficulty, kind: ShotKind, combo: number, at: number) {
  const settings = DIFFICULTIES[difficulty];
  const motion = Math.round(target.speed * 0.62 + (target.volatile ? 34 : 0));
  const chicken = kind === "cat" ? 0.85 : CHICKENS[kind].scoreMultiplier;
  const streak = 1 + Math.min(combo, 8) * 0.07;
  return Math.round((125 + motion) * settings.scoreMultiplier * chicken * streak * (at >= 75000 ? 1.2 : 1));
}

export function validateRun(events: RunEvent[], seed: number, difficulty: Difficulty, bonusTimes: number[]) {
  if (!Array.isArray(events) || events.length > 950) throw new Error("Invalid run log");
  const shots = new Map<number, ShotEvent>();
  const shotHits = new Map<number, number>();
  const hitTargets = new Set<string>();
  let score = 0, hits = 0, combo = 0, bestCombo = 0, cats = 0, lastShot = -1000, lastHit = -10000, previousAt = -1;
  for (const event of events) {
    if (!event || !Number.isInteger(event.at) || event.at < 0 || event.at > 90500 || event.at < previousAt) throw new Error("Invalid event order");
    previousAt = event.at;
    if (event.type === "shot") {
      if (!Number.isInteger(event.id) || shots.has(event.id) || event.at > 90000 || event.at - lastShot < 260 || ![...Object.keys(CHICKENS), "cat"].includes(event.kind) || !Number.isFinite(event.pullX) || !Number.isFinite(event.pullY) || Math.hypot(event.pullX, event.pullY) < 20 || Math.hypot(event.pullX, event.pullY) > 191 || event.pullY < 12) throw new Error("Invalid shot");
      if (event.kind === "cat" && ++cats > 4) throw new Error("Too many special shots");
      shots.set(event.id, event); lastShot = event.at;
    } else if (event.type === "hit") {
      const shot = shots.get(event.shotId);
      if (!shot || event.at < shot.at + (shot.kind === "cat" ? 35 : 75) || event.at - shot.at > 2400 || hitTargets.has(String(event.target))) throw new Error("Invalid hit");
      const count = (shotHits.get(shot.id) ?? 0) + 1;
      if (count > (shot.kind === "cat" ? 5 : CHICKENS[shot.kind].maxTargetsPerShot)) throw new Error("Impossible shot");
      const position = projectilePosition(shot, event.at);
      let value: number;
      if (typeof event.target === "number" && Number.isInteger(event.target) && event.target >= 0 && event.target < 140) {
        const target = targetAt(seed, event.target, difficulty);
        if (event.at < target.spawnAt || event.at - target.spawnAt > 13000) throw new Error("Target not in round");
        const expected = targetPosition(target, event.at);
        if (Math.hypot(position.x - expected.x, position.y - expected.y) > (shot.kind === "cat" ? 225 : (70 + CHICKENS[shot.kind].collisionRadius) * DIFFICULTIES[difficulty].hitboxScale + 6)) throw new Error("Hit outside target");
        value = calculateHitValue(target, difficulty, shot.kind, event.at - lastHit <= 2500 ? combo + 1 : 1, event.at);
      } else if (typeof event.target === "string" && /^bonus-[01]$/.test(event.target)) {
        const index = Number(event.target.slice(-1));
        const bonus = bonusAt(seed, index, bonusTimes);
        if (event.at < bonus.at || event.at > bonus.at + 3700 || Math.hypot(position.x - bonus.x, position.y - bonus.y) > (shot.kind === "cat" ? 240 : 100)) throw new Error("Bonus outside window");
        value = 2200;
      } else throw new Error("Unknown target");
      score += value; hits++; combo = event.at - lastHit <= 2500 ? combo + 1 : 1; bestCombo = Math.max(bestCombo, combo); lastHit = event.at;
      hitTargets.add(String(event.target)); shotHits.set(shot.id, count);
    } else throw new Error("Unknown event");
  }
  return { score, hits, shots: shots.size, successfulShots: shotHits.size, bestCombo };
}

export function isDifficulty(value: unknown): value is Difficulty { return value === "easy" || value === "medium" || value === "hard"; }
