import Phaser from "phaser";
import registry from "@/src/data/assets.json";
import { CHICKENS, DIFFICULTIES, GAMEPLAY } from "@/src/data/game-config";
import { bonusAt, calculateHitValue, projectilePosition, targetAt, targetPosition, type ChickenId, type Difficulty, type RunEvent, type ShotEvent } from "@/src/game/systems/rules";

type FaceState = "normal" | "angry" | "crying";
type FaceIdentity = keyof typeof registry.targets;
type TargetView = { descriptor: ReturnType<typeof targetAt>; body: Phaser.GameObjects.Container; face: Phaser.GameObjects.Image; lastSwap: number };
type ProjectileView = { shot: ShotEvent; image: Phaser.GameObjects.Image; hitCount: number; struck: Set<string> };
export type RoundSnapshot = { remaining: number; score: number; hits: number; shots: number; combo: number; cats: number };
export type RoundOptions = { seed: number; bonusTimes: number[]; difficulty: Difficulty; sensitivity: number; motion: number; onSnapshot: (value: RoundSnapshot) => void; onFinish: (events: RunEvent[]) => void; onSound: (tone: "shot" | "hit" | "bonus") => void };

class ShuffleBag {
  private bags = new Map<string, string[]>();
  private previous = new Map<string, string>();
  next(identity: FaceIdentity, state: FaceState) {
    const key = `${identity}:${state}`;
    const paths = registry.targets[identity][state];
    let bag = this.bags.get(key);
    if (!bag?.length) {
      bag = [...paths];
      for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
      if (bag.length > 1 && bag[bag.length - 1] === this.previous.get(key)) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      this.bags.set(key, bag);
    }
    const path = bag.pop()!;
    this.previous.set(key, path);
    return path;
  }
}

export class RoundScene extends Phaser.Scene {
  private options: RoundOptions;
  private faces = new ShuffleBag();
  private elapsed = 0;
  private nextTarget = 0;
  private targets = new Map<number, TargetView>();
  private projectiles: ProjectileView[] = [];
  private runEvents: RunEvent[] = [];
  private nextShot = 0;
  private lastShotAt = -1000;
  private kind: ChickenId | "cat" = "chicken2";
  private cats = 4;
  private dragging = false;
  private pullX = 0;
  private pullY = 0;
  private score = 0;
  private hits = 0;
  private combo = 0;
  private lastHit = -10000;
  private bonusViews = new Map<number, Phaser.GameObjects.Image>();
  private collectedBonuses = new Set<number>();
  private atmosphere!: Phaser.GameObjects.Graphics;
  private sling!: Phaser.GameObjects.Graphics;
  private loaded!: Phaser.GameObjects.Image;
  private lastSnapshot = -1000;
  private stopped = false;

  constructor(options: RoundOptions) { super({ key: "RoundScene" }); this.options = options; }

  preload() {
    for (const [identity, states] of Object.entries(registry.targets)) {
      for (const state of ["normal", "angry", "crying"] as const) {
        for (const path of states[state]) this.load.image(path, path);
      }
      void identity;
    }
    for (const chicken of Object.values(CHICKENS)) this.load.svg(chicken.asset, chicken.asset, { width: 100, height: 100 });
    for (const cat of registry.moodBasket.cats) this.load.image(cat, cat);
    this.load.image(registry.targets.trump.bonus[0], registry.targets.trump.bonus[0]);
  }

  create() {
    this.drawEnvironment();
    this.atmosphere = this.add.graphics().setDepth(2);
    this.sling = this.add.graphics().setDepth(12);
    this.loaded = this.add.image(GAMEPLAY.slingshot.x, GAMEPLAY.slingshot.y, CHICKENS.chicken2.asset).setDisplaySize(72, 72).setDepth(13);
    this.drawSling();
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.stopped || this.dragging || Math.hypot(pointer.x - GAMEPLAY.slingshot.x, pointer.y - GAMEPLAY.slingshot.y) > 105) return;
      this.dragging = true; this.updatePull(pointer);
    });
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => { if (this.dragging) this.updatePull(pointer); });
    this.input.on("pointerup", () => this.release());
    this.input.on("pointerupoutside", () => this.release());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { this.input.removeAllListeners(); });
    this.options.onSnapshot(this.snapshot());
  }

  setKind(kind: ChickenId | "cat") {
    if (kind === "cat" && this.cats === 0) return;
    this.kind = kind;
    this.loaded.setTexture(kind === "cat" ? registry.moodBasket.cats[4 - this.cats] : CHICKENS[kind].asset);
    this.loaded.setDisplaySize(kind === "cat" ? 79 : 72, kind === "cat" ? 79 : 72);
  }

  private updatePull(pointer: Phaser.Input.Pointer) {
    const gain = 0.6 + this.options.sensitivity / 100;
    const dx = (pointer.x - GAMEPLAY.slingshot.x) * gain, dy = (pointer.y - GAMEPLAY.slingshot.y) * gain;
    const scale = Math.min(1, GAMEPLAY.slingshot.maxPullPixels / (Math.hypot(dx, dy) || 1));
    this.pullX = dx * scale;
    this.pullY = Math.max(0, dy * scale);
    this.loaded.setPosition(GAMEPLAY.slingshot.x + this.pullX, GAMEPLAY.slingshot.y + this.pullY);
    this.drawSling();
  }

  private release() {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.pullY >= 12 && Math.hypot(this.pullX, this.pullY) >= 20 && this.elapsed < 90000) {
      const at = Math.round(this.elapsed), kind = this.kind;
      const shot: ShotEvent = { type: "shot", id: this.nextShot++, at, kind, pullX: Math.round(this.pullX), pullY: Math.round(this.pullY) };
      if (at - this.lastShotAt < 260) { this.resetSling(); return; }
      this.lastShotAt = at;
      this.runEvents.push(shot);
      const image = this.add.image(GAMEPLAY.slingshot.x, GAMEPLAY.slingshot.y, kind === "cat" ? registry.moodBasket.cats[4 - this.cats] : CHICKENS[kind].asset).setDisplaySize(kind === "cat" ? 82 : 64, kind === "cat" ? 82 : 64).setDepth(9);
      this.projectiles.push({ shot, image, hitCount: 0, struck: new Set() });
      if (kind === "cat") { this.cats--; this.setKind(this.cats ? "cat" : "chicken2"); }
      this.options.onSound("shot");
      if (this.options.motion > 0) this.cameras.main.shake(55, 0.0013 * this.options.motion);
    }
    this.resetSling();
  }

  private resetSling() { this.pullX = 0; this.pullY = 0; this.loaded.setPosition(GAMEPLAY.slingshot.x, GAMEPLAY.slingshot.y); this.drawSling(); }

  private drawSling() {
    const { x, y } = GAMEPLAY.slingshot;
    this.sling.clear();
    this.sling.lineStyle(14, 0x654632).lineBetween(x, y - 8, x, y + 95);
    this.sling.lineStyle(13, 0x8f6848).lineBetween(x, y + 20, x - 48, y - 58);
    this.sling.lineBetween(x, y + 20, x + 48, y - 58);
    this.sling.lineStyle(5, 0xe9a440).lineBetween(x - 48, y - 58, x + this.pullX, y + this.pullY);
    this.sling.lineBetween(x + 48, y - 58, x + this.pullX, y + this.pullY);
    this.sling.fillStyle(0x080f11).fillEllipse(x, y + 92, 166, 25);
    if (this.dragging && this.pullY >= 12 && DIFFICULTIES[this.options.difficulty].trajectoryGuide) {
      const preview: ShotEvent = { type: "shot", id: -1, at: 0, kind: this.kind, pullX: this.pullX, pullY: this.pullY };
      for (let ms = 90; ms < 820; ms += 60) {
        const point = projectilePosition(preview, ms);
        if (point.y < 40 || point.x < 40 || point.x > 1560) break;
        this.sling.fillStyle(0xa7eb29, 0.55 * (1 - ms / 950)).fillCircle(point.x, point.y, 4);
      }
    }
  }

  private drawEnvironment() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x080f11).fillRect(0, 0, 1600, 900);
    g.fillStyle(0x192a2b).fillRoundedRect(92, -330, 1416, 1200, 640);
    g.lineStyle(56, 0x2b403d, 0.8).strokeRoundedRect(86, -335, 1428, 1230, 640);
    g.lineStyle(20, 0x50615a, 0.65).strokeRoundedRect(115, -290, 1370, 1170, 600);
    for (let row = 0; row < 21; row++) for (let column = 0; column < 32; column++) {
      const x = column * 54 + (row % 2) * 27 - 18, y = row * 47 - 30;
      if (x > 130 && x < 1470 && y > 30 && y < 810) continue;
      g.fillStyle((row + column) % 5 === 0 ? 0x344944 : 0x273a38, 0.8).fillRect(x + 2, y + 2, 50, 42);
      g.lineStyle(1, 0x50615a, 0.3).strokeRect(x + 2, y + 2, 50, 42);
    }
    for (const x of [160, 1420]) {
      g.fillStyle(0x354a49).fillRect(x, 0, 28, 900);
      g.fillStyle(0xe9a440).fillRect(x - 8, 93, 44, 12);
      g.fillStyle(0xe9a440).fillRect(x - 8, 680, 44, 12);
      for (let y = 70; y < 810; y += 100) { g.fillStyle(0x080f11).fillCircle(x + 14, y, 6); g.fillStyle(0x68746b).fillCircle(x + 12, y - 2, 2); }
    }
    g.fillStyle(0x0c1c1b).fillEllipse(800, 870, 1170, 255);
    g.fillStyle(0x305a46).fillEllipse(800, 905, 1250, 180);
    g.fillStyle(0xa7eb29, 0.32).fillEllipse(800, 905, 1040, 97);
    for (let i = 0; i < 4; i++) {
      const y = GAMEPLAY.lanes[i];
      g.fillStyle(0x080f11).fillRect(175, y + 32, 1250, 23);
      g.fillStyle(0x50615a).fillRect(190, y + 25, 1220, 13);
      g.fillStyle(0x394845).fillRect(190, y + 42, 1220, 8);
      for (let x = 210; x < 1400; x += 43) { g.fillStyle(0x080f11).fillRect(x, y + 27, 16, 9); g.fillStyle(0x68746b).fillRect(x + 3, y + 42, 2, 8); }
      g.fillStyle(0xe9a440).fillRect(202, y + 26, 20, 10);
      g.fillStyle(0xe9a440).fillRect(1380, y + 26, 20, 10);
      this.add.text(1360, y - 44, `RATWAY ${i + 1}`, { fontFamily: "monospace", fontSize: "18px", color: "#d3dbc7" }).setOrigin(1, 0).setAlpha(0.75);
    }
    g.fillStyle(0x080f11).fillRoundedRect(1310, 730, 186, 75, 10);
    g.lineStyle(3, 0xe9a440).strokeRoundedRect(1310, 730, 186, 75, 10);
    this.add.text(1330, 745, "SEWER / 04\nAUTHORIZED? NO", { fontFamily: "monospace", fontSize: "15px", color: "#e9a440" }).setDepth(1);
    for (let i = 0; i < 8; i++) { g.fillStyle(0xa7eb29, 0.4).fillCircle(450 + i * 125, 828 + (i % 2) * 18, 3 + (i % 3)); }
    g.fillStyle(0xe9a440, 0.5).fillCircle(248, 130, 14).fillCircle(1350, 242, 10);
    g.lineStyle(7, 0x4d5c53).lineBetween(0, 44, 1600, 44);
    for (let x = 100; x < 1600; x += 200) g.fillStyle(0x50615a).fillRect(x, 36, 26, 18);
  }

  update(_time: number, delta: number) {
    if (this.stopped) return;
    this.elapsed = Math.min(90500, this.elapsed + Math.min(delta, 100));
    this.drawAtmosphere();
    while (this.nextTarget < 140 && targetAt(this.options.seed, this.nextTarget, this.options.difficulty).spawnAt <= this.elapsed && this.elapsed < 90000) this.spawnTarget(this.nextTarget++);
    for (const [id, view] of this.targets) {
      const position = targetPosition(view.descriptor, this.elapsed);
      view.body.setPosition(position.x, position.y);
      view.body.scaleY = 1 + Math.sin(this.elapsed / 85 + id) * 0.04;
      if (this.elapsed - view.lastSwap > 330 + (id % 4) * 75) { view.face.setTexture(this.faces.next(view.descriptor.identity, "normal")); view.lastSwap = this.elapsed; }
      if (position.x < -130 || position.x > 1730) { view.body.destroy(); this.targets.delete(id); }
    }
    for (let i = 0; i < 2; i++) this.showBonus(i);
    for (const projectile of [...this.projectiles]) this.advanceProjectile(projectile);
    if (this.elapsed - this.lastSnapshot >= 140) { this.lastSnapshot = this.elapsed; this.options.onSnapshot(this.snapshot()); }
    if (this.elapsed >= 90500) { this.stopped = true; this.options.onFinish([...this.runEvents]); }
  }

  private spawnTarget(id: number) {
    const descriptor = targetAt(this.options.seed, id, this.options.difficulty);
    const body = this.add.container(0, 0).setDepth(5);
    const art = this.add.graphics();
    art.lineStyle(8, 0x50615a).beginPath().moveTo(-44 * descriptor.direction, 8).lineTo(-99 * descriptor.direction, 6).lineTo(-123 * descriptor.direction, -14).strokePath();
    art.fillStyle(0x080f11).fillEllipse(0, 22, 122, 51);
    art.fillStyle(0x68746b).fillEllipse(0, 15, 101, 48);
    art.fillStyle(0x354a49).fillEllipse(12 * descriptor.direction, 9, 58, 29);
    for (const foot of [-31, 28]) art.fillStyle(0x080f11).fillEllipse(foot, 43, 26, 10);
    body.add(art);
    const face = this.add.image(28 * descriptor.direction, -32, this.faces.next(descriptor.identity, "normal")).setDisplaySize(86, 90);
    body.add(face);
    this.targets.set(id, { descriptor, body, face, lastSwap: this.elapsed });
  }

  private showBonus(index: number) {
    const bonus = bonusAt(this.options.seed, index, this.options.bonusTimes);
    const active = !this.collectedBonuses.has(index) && this.elapsed >= bonus.at && this.elapsed <= bonus.at + 3700;
    const existing = this.bonusViews.get(index);
    if (!active) { if (existing) { existing.destroy(); this.bonusViews.delete(index); } return; }
    if (existing) { existing.setAlpha(Math.min(1, (this.elapsed - bonus.at) / 400)); return; }
    const image = this.add.image(bonus.x, bonus.y, registry.targets.trump.bonus[0]).setDisplaySize(114, 148).setAlpha(0).setDepth(4);
    this.bonusViews.set(index, image);
  }

  private advanceProjectile(projectile: ProjectileView) {
    const { shot, image } = projectile;
    const age = this.elapsed - shot.at;
    const position = projectilePosition(shot, this.elapsed);
    image.setPosition(position.x, position.y).setAngle(age * (shot.kind === "cat" ? 0.12 : 0.3));
    if (age > 2400 || position.x < -100 || position.x > 1700 || position.y < -100 || position.y > 980) { image.destroy(); this.projectiles.splice(this.projectiles.indexOf(projectile), 1); return; }
    if (age < 80) return;
    const maxHits = shot.kind === "cat" ? 5 : CHICKENS[shot.kind].maxTargetsPerShot;
    for (const [id, target] of this.targets) {
      if (projectile.hitCount >= maxHits) break;
      if (projectile.struck.has(String(id))) continue;
      const expected = targetPosition(target.descriptor, this.elapsed);
      if (Math.hypot(position.x - expected.x, position.y - expected.y) < (shot.kind === "cat" ? 218 : (70 + CHICKENS[shot.kind].collisionRadius) * DIFFICULTIES[this.options.difficulty].hitboxScale)) {
        this.hit(projectile, id, expected.x, expected.y, target);
      }
    }
    for (let index = 0; index < 2; index++) {
      if (projectile.hitCount >= maxHits) break;
      const bonus = bonusAt(this.options.seed, index, this.options.bonusTimes);
      if (this.elapsed >= bonus.at && this.elapsed <= bonus.at + 3700 && !projectile.struck.has(`bonus-${index}`) && Math.hypot(position.x - bonus.x, position.y - bonus.y) < (shot.kind === "cat" ? 225 : 85)) this.hit(projectile, `bonus-${index}`, bonus.x, bonus.y);
    }
    if (projectile.hitCount >= (shot.kind === "cat" ? 5 : CHICKENS[shot.kind].maxTargetsPerShot)) { image.destroy(); this.projectiles.splice(this.projectiles.indexOf(projectile), 1); }
  }

  private hit(projectile: ProjectileView, id: number | `bonus-${number}`, x: number, y: number, target?: TargetView) {
    if (projectile.struck.has(String(id)) || this.runEvents.some(event => event.type === "hit" && String(event.target) === String(id))) return;
    projectile.struck.add(String(id)); projectile.hitCount++;
    const at = Math.round(this.elapsed), shot = projectile.shot;
    this.runEvents.push({ type: "hit", shotId: shot.id, at, target: id });
    this.combo = at - this.lastHit <= 2500 ? this.combo + 1 : 1; this.lastHit = at; this.hits++;
    const value = target ? calculateHitValue(target.descriptor, this.options.difficulty, shot.kind, this.combo, at) : 2200;
    this.score += value; this.options.onSound(target ? "hit" : "bonus");
    if (target) {
      this.targets.delete(id as number);
      target.face.setTexture(this.faces.next(target.descriptor.identity, "angry"));
      this.tweens.add({ targets: target.body, x: x + (x < 800 ? -150 : 150) * (shot.kind === "cat" ? 1.3 : CHICKENS[shot.kind].knockbackMultiplier), y: y - 100, angle: shot.kind === "cat" ? 450 : 180, duration: 2000, ease: "Cubic.easeOut", onComplete: () => { if (!target.body.active) return; target.face.setTexture(this.faces.next(target.descriptor.identity, "crying")); this.tweens.add({ targets: target.body, y: 940, alpha: 0, angle: 750, duration: 800, onComplete: () => target.body.destroy() }); } });
    } else {
      const bonusIndex = Number(String(id).slice(-1));
      this.collectedBonuses.add(bonusIndex);
      const art = this.bonusViews.get(bonusIndex);
      if (art) { this.bonusViews.delete(bonusIndex); this.tweens.add({ targets: art, angle: 1440, x: x + 240, y: -180, duration: 850, onComplete: () => art.destroy() }); }
    }
    const label = this.add.text(x, y - 60, `${target ? "BONK" : "BONUS!"} +${value}`, { fontFamily: "monospace", fontSize: "32px", fontStyle: "bold", color: "#a7eb29", stroke: "#080f11", strokeThickness: 7 }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: label, y: y - 125, alpha: 0, duration: 700, onComplete: () => label.destroy() });
    if (this.options.motion > 0) this.cameras.main.shake(80, 0.002 * this.options.motion);
  }

  private drawAtmosphere() {
    this.atmosphere.clear();
    for (let i = 0; i < 28; i++) {
      const phase = (this.elapsed / (1550 + (i % 6) * 230) + i * 0.318) % 1;
      const x = 260 + ((i * 151) % 1080);
      const y = 872 - phase * (i % 3 ? 95 : 165);
      this.atmosphere.lineStyle(2, 0xa7eb29, (1 - phase) * 0.46).strokeCircle(x, y, 2 + (i % 5) * 2);
    }
    for (let i = 0; i < 5; i++) {
      const x = 240 + i * 272;
      const phase = (this.elapsed / 2000 + i * 0.23) % 1;
      this.atmosphere.fillStyle(0xd3dbc7, (1 - phase) * 0.1).fillEllipse(x + Math.sin(this.elapsed / 600 + i) * 17, 780 - phase * 145, 37 + phase * 35, 19);
    }
  }

  private snapshot(): RoundSnapshot { return { remaining: Math.max(0, Math.ceil((90000 - this.elapsed) / 1000)), score: this.score, hits: this.hits, shots: this.nextShot, combo: this.combo, cats: this.cats }; }
}
