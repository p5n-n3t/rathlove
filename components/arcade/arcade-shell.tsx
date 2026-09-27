"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import { Intro } from "./intro";
import { Menu } from "./menu";
import { Setup } from "./setup";
import { Leaderboard } from "./leaderboard";
import { OptionsPanel, defaultOptions, type ArcadeOptions } from "./options";
import { GameBoard } from "./game-board";
import { Results } from "./results";
import { validateRun, type Difficulty, type RunEvent } from "@/src/game/systems/rules";

type Phase = "intro" | "menu" | "setup" | "descent" | "playing" | "results" | "leaderboard" | "options" | "help";
type Session = { id: string; seed: number; bonusTimes: number[]; startedAt: string };
type Totals = { score: number; hits: number; shots: number; successfulShots: number; bestCombo: number };
const empty: Totals = { score: 0, hits: 0, shots: 0, successfulShots: 0, bestCombo: 0 };

export function ArcadeShell() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [session, setSession] = useState<Session | null>(null);
  const [callsign, setCallsign] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [options, setOptions] = useState<ArcadeOptions>(defaultOptions);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [totals, setTotals] = useState<Totals>(empty);
  const [filing, setFiling] = useState<"filing" | "filed" | "failed">("filing");
  const [rank, setRank] = useState<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<number | null>(null);
  const skipIntro = useCallback(() => setPhase("menu"), []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (phase !== "descent" && phase !== "playing" && musicRef.current !== null) {
      window.clearInterval(musicRef.current);
      musicRef.current = null;
    }
  }, [phase]);

  function beginMusic() {
    if (!options.music || !options.master || musicRef.current !== null) return;
    try {
      const context = audioRef.current ?? new AudioContext(); audioRef.current = context;
      if (context.state === "suspended") void context.resume();
      const notes = [110, 165, 220, 165, 130.81, 196, 220, 146.83];
      let step = 0;
      musicRef.current = window.setInterval(() => {
        const start = context.currentTime;
        const wave = context.createOscillator(), gain = context.createGain();
        wave.type = "triangle"; wave.frequency.value = notes[step++ % notes.length];
        gain.gain.setValueAtTime(options.music * options.master / 260000, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);
        wave.connect(gain).connect(context.destination); wave.start(start); wave.stop(start + 0.2);
      }, 280);
    } catch { /* The game remains playable when audio is unavailable. */ }
  }

  const playSound = useCallback((tone: "shot" | "hit" | "bonus") => {
    if (options.master === 0 || options.effects === 0) return;
    try {
      const context = audioRef.current ?? new AudioContext(); audioRef.current = context;
      if (context.state === "suspended") void context.resume();
      const wave = context.createOscillator(), volume = context.createGain();
      const start = context.currentTime;
      wave.type = tone === "shot" ? "triangle" : "square";
      wave.frequency.setValueAtTime(tone === "bonus" ? 410 : tone === "hit" ? 260 : 630, start);
      wave.frequency.exponentialRampToValueAtTime(tone === "shot" ? 120 : 64, start + 0.17);
      volume.gain.setValueAtTime(Math.min(0.09, options.master * options.effects / 120000), start);
      volume.gain.exponentialRampToValueAtTime(0.001, start + 0.19);
      wave.connect(volume).connect(context.destination); wave.start(start); wave.stop(start + 0.2);
    } catch { /* Audio is optional when the browser denies playback. */ }
  }, [options.master, options.effects]);

  async function startRound(nextName: string, nextDifficulty: Difficulty) {
    setError(""); setPending(true); setCallsign(nextName); setDifficulty(nextDifficulty); setPhase("descent");
    try {
      if (window.matchMedia("(max-width: 700px) and (orientation: landscape)").matches) void document.documentElement.requestFullscreen?.().catch(() => {});
      await new Promise(resolve => window.setTimeout(resolve, options.motion ? 6200 : 2500));
      const response = await fetch("/api/runs/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ callsign: nextName, difficulty: nextDifficulty }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The tunnel could not open. Try again.");
      setSession(data); setEvents([]); setTotals(empty); setFiling("filing"); setRank(null); setPhase("playing");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The tunnel could not open."); setPhase("setup"); }
    finally { setPending(false); }
  }

  const submit = useCallback(async (runEvents: RunEvent[]) => {
    if (!session) return;
    try { setTotals(validateRun(runEvents, session.seed, difficulty, session.bonusTimes)); }
    catch { setFiling("failed"); return; }
    setFiling("filing");
    try {
      const response = await fetch("/api/runs/finish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: session.id, events: runEvents }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Score could not be filed");
      setRank(data.rank); setFiling("filed");
      void mutate((key: unknown) => typeof key === "string" && key.startsWith("/api/leaderboard"));
    } catch { setFiling("failed"); }
  }, [session, difficulty]);

  const finish = useCallback((runEvents: RunEvent[]) => {
    if (!session) return;
    setEvents(runEvents);
    try { setTotals(validateRun(runEvents, session.seed, difficulty, session.bonusTimes)); }
    catch { setTotals(empty); }
    setPhase("results"); void submit(runEvents);
  }, [session, difficulty, submit]);

  return <main className="arcade font-mono"><div className="cabinet"><div className="cabinet-top"><span className="cabinet-light" aria-hidden="true"/> RATHLOVE / ARCADE SYSTEM <span>NO. 004—1991</span></div>
    {phase === "intro" && <Intro onSkip={skipIntro} />}
    {phase === "menu" && <Menu onStart={() => setPhase("setup")} onOptions={() => setPhase("options")} onHelp={() => setPhase("help")} onLeaderboard={() => setPhase("leaderboard")} onReplayIntro={() => setPhase("intro")} />}
    {phase === "setup" && <Setup initialDifficulty={difficulty} onStart={(name, mode) => void startRound(name, mode)} onBack={() => setPhase("menu")} pending={pending} error={error} />}
    {phase === "descent" && <section className="descent-screen"><img src="/assets/intro/rathbone/full-body.webp" alt="Rathbone enters the tunnel"/><div><span className="kicker">Access hatch 04 / City to sewer</span><h1>Going under.</h1><p>Infestation level: {difficulty.toUpperCase()}</p><div className="loading-bar"><span/></div><small>Rats detected. Chickens armed. Municipal liability waived.</small></div></section>}
    {phase === "playing" && session && <GameBoard seed={session.seed} bonusTimes={session.bonusTimes} callsign={callsign} difficulty={difficulty} motion={options.motion} sensitivity={options.sensitivity} onFinish={finish} onSound={playSound} />}
    {phase === "results" && <Results callsign={callsign} difficulty={difficulty} totals={totals} status={filing} rank={rank} onRetry={() => void submit(events)} onReplay={() => void startRound(callsign, difficulty)} onMenu={() => setPhase("menu")} onLeaderboard={() => setPhase("leaderboard")} />}
    {phase === "leaderboard" && <section className="subscreen records-screen"><button className="text-button" onClick={() => setPhase("menu")}>‹ Back to menu</button><Leaderboard /></section>}
    {phase === "options" && <OptionsPanel values={options} onChange={setOptions} onBack={() => setPhase("menu")} />}
    {phase === "help" && <section className="subscreen help-screen"><button className="text-button" onClick={() => setPhase("menu")}>‹ Back to menu</button><span className="kicker">Training tape / 03</span><h1>How to play</h1><ol><li><b>Choose a callsign.</b> No account required. Every run gets its own place in the archives.</li><li><b>Hold and drag the chicken down.</b> Release to launch it opposite the pull. Lead moving targets: the chicken takes time to travel.</li><li><b>Switch chickens.</b> Heavy reaches two targets; balanced is forgiving; fast is precise. Use the Mood Basket cat for an area blast, four times per round.</li><li><b>Watch for a special visitor.</b> The bonus appears twice. You have ninety seconds in the sewer.</li></ol><button className="primary-button" onClick={() => setPhase("setup")}>Got it. Start game ›</button></section>}
    <div className="cabinet-bottom"><span>RATH-A-MOLE</span><span>RATLOVE.ME</span><span>CRT / WEB EDITION</span></div>
  </div></main>;
}
