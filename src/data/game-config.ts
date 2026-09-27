export const GAME_DURATION_SECONDS = 90;
export const INTRO_DURATION_SECONDS = 90;
export const SEWER_TRANSITION_SECONDS = 6;
export const ANGRY_REACTION_SECONDS = 2;

export const CHICKENS = {
  chicken1: {
    id: "chicken1",
    label: "HEAVY",
    asset: "/assets/game/chickens/chicken-1.svg",
    speedMultiplier: 0.78,
    knockbackMultiplier: 1.45,
    collisionRadius: 22,
    maxTargetsPerShot: 2,
    scoreMultiplier: 1.15,
    description: "Slowest launch, strongest impact, can punch through a second target.",
  },
  chicken2: {
    id: "chicken2",
    label: "BALANCED",
    asset: "/assets/game/chickens/chicken-2.svg",
    speedMultiplier: 1,
    knockbackMultiplier: 1,
    collisionRadius: 17,
    maxTargetsPerShot: 1,
    scoreMultiplier: 1,
    description: "Medium speed, medium impact, forgiving all-purpose chicken.",
  },
  chicken3: {
    id: "chicken3",
    label: "FAST",
    asset: "/assets/game/chickens/chicken-3.svg",
    speedMultiplier: 1.3,
    knockbackMultiplier: 0.72,
    collisionRadius: 12,
    maxTargetsPerShot: 1,
    scoreMultiplier: 1.25,
    description: "Fastest launch and smallest hit radius. Best for precision shots.",
  },
} as const;

export const DIFFICULTIES = {
  easy: {
    label: "EASY",
    targetSpeedRange: [80, 125],
    maxSimultaneousTargets: 6,
    spawnIntervalMs: [800, 1250],
    hitboxScale: 1.2,
    aimReactionStrength: 0.2,
    scoreMultiplier: 1,
    trajectoryGuide: true,
  },
  medium: {
    label: "MEDIUM",
    targetSpeedRange: [120, 185],
    maxSimultaneousTargets: 8,
    spawnIntervalMs: [600, 950],
    hitboxScale: 1,
    aimReactionStrength: 0.45,
    scoreMultiplier: 1.5,
    trajectoryGuide: false,
  },
  hard: {
    label: "HARD",
    targetSpeedRange: [165, 255],
    maxSimultaneousTargets: 10,
    spawnIntervalMs: [425, 725],
    hitboxScale: 0.86,
    aimReactionStrength: 0.72,
    scoreMultiplier: 2.25,
    trajectoryGuide: false,
  },
} as const;

export const GAMEPLAY = {
  virtualWidth: 1600,
  virtualHeight: 900,
  slingshot: {
    x: 800,
    y: 748,
    maxPullPixels: 190,
    minLaunchSpeed: 650,
    maxLaunchSpeed: 1450,
  },
  lanes: [170, 310, 450, 590],
  normalFaceSwapMs: [240, 460],
  comboWindowMs: 2500,
  panicStartSecondsRemaining: 15,
  panicSpeedMultiplier: 1.1,
} as const;
