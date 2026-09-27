"use client";

import { useEffect, useRef, useState } from "react";
import { CHICKENS } from "@/src/data/game-config";
import type { ChickenId, Difficulty, RunEvent } from "@/src/game/systems/rules";
import type { RoundScene, RoundSnapshot } from "@/src/game/scenes/round-scene";

type Props = { seed: number; bonusTimes: number[]; callsign: string; difficulty: Difficulty; motion: number; sensitivity: number; onFinish: (events: RunEvent[]) => void; onSound: (tone: "shot" | "hit" | "bonus") => void };
const initial: RoundSnapshot = { remaining: 90, score: 0, hits: 0, shots: 0, combo: 0, cats: 4 };

export function GameBoard({ seed, bonusTimes, callsign, difficulty, motion, sensitivity, onFinish, onSound }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoundScene | null>(null);
  const [snapshot, setSnapshot] = useState(initial);
  const [selection, setSelection] = useState<ChickenId | "cat">("chicken2");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let disposed = false;
    let game: import("phaser").Game | null = null;
    let media: MediaQueryList | null = null;
    let onRotate: (() => void) | undefined;
    Promise.all([import("phaser"), import("@/src/game/scenes/round-scene")]).then(([{ default: Phaser }, { RoundScene }]) => {
      if (disposed || !mount.current) return;
      const scene = new RoundScene({ seed, bonusTimes, difficulty, motion, sensitivity, onSnapshot: setSnapshot, onFinish, onSound });
      sceneRef.current = scene;
      game = new Phaser.Game({ type: Phaser.AUTO, backgroundColor: "#080f11", parent: mount.current, pixelArt: true, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, expandParent: false, width: 1600, height: 900 }, scene: [scene], render: { antialias: false }, banner: false });
      media = window.matchMedia("(max-width: 700px) and (orientation: portrait)");
      onRotate = () => { if (media?.matches) game?.pause(); else game?.resume(); };
      media.addEventListener("change", onRotate);
      onRotate();
      setLoading(false);
    }).catch(() => { if (!disposed) setError(true); });
    return () => { disposed = true; if (media && onRotate) media.removeEventListener("change", onRotate); sceneRef.current = null; game?.destroy(true); };
  }, [seed, bonusTimes, difficulty, motion, sensitivity, onFinish, onSound]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const keys = { "1": "chicken1", "2": "chicken2", "3": "chicken3", "4": "cat" } as const;
      const kind = keys[event.key as keyof typeof keys];
      if (kind && !loading && !(event.target instanceof HTMLInputElement)) { sceneRef.current?.setKind(kind); setSelection(kind); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading]);
  function choose(kind: ChickenId | "cat") { sceneRef.current?.setKind(kind); setSelection(kind); }
  const time = `${String(Math.floor(snapshot.remaining / 60)).padStart(2, "0")}:${String(snapshot.remaining % 60).padStart(2, "0")}`;
  return <section className="round-screen" aria-label="RATH-A-MOLE live round">
    <div className="round-top"><div className="round-identity"><span>{callsign}</span><small>{difficulty} / TUNNEL 04</small></div><div className={`round-clock ${snapshot.remaining <= 15 ? "panic" : ""}`} aria-label={`${snapshot.remaining} seconds remaining`}>{time}</div><div className="round-score"><small>Score / Combo {snapshot.combo > 1 ? `×${snapshot.combo}` : ""}</small><strong>{snapshot.score.toLocaleString()}</strong></div></div>
    <div className="game-stage"><div ref={mount} className="game-mount" />{loading && !error && <div className="stage-loading">Opening ratway gates...</div>}{error && <div className="stage-loading">The tunnel failed to load. Return to menu and try again.</div>}
      <div className="rotate-device"><img src="/assets/game/chickens/chicken-2.svg" alt="" /><h2>Rotate device</h2><p>The ratways only open in landscape.</p></div>
      {snapshot.remaining === 90 && !loading && <div className="game-hint">Hold the chicken. Pull down. Release to fire.</div>}
    </div>
    <div className="round-controls"><div className="chicken-controls" role="group" aria-label="Choose projectile">{(Object.keys(CHICKENS) as ChickenId[]).map((kind, index) => <button type="button" key={kind} className={`ammo-button ${selection === kind ? "selected" : ""}`} aria-pressed={selection === kind} disabled={loading} onClick={() => choose(kind)}><img src={CHICKENS[kind].asset} alt=""/><span>{index + 1} {CHICKENS[kind].label}</span></button>)}</div><button type="button" className={`ammo-button cat-button ${selection === "cat" ? "selected" : ""}`} disabled={loading || !snapshot.cats} aria-pressed={selection === "cat"} onClick={() => choose("cat")}><img src="/assets/game/mood-basket/mood-basket-cat-1.webp" alt=""/><span>MOOD BASKET ×{snapshot.cats}</span></button></div>
  </section>;
}
