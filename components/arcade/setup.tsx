"use client";

import { useState, type FormEvent } from "react";
import { CHICKENS, DIFFICULTIES } from "@/src/data/game-config";
import type { Difficulty } from "@/src/game/systems/rules";

export function Setup({ initialDifficulty, onStart, onBack, pending, error }: { initialDifficulty: Difficulty; onStart: (callsign: string, difficulty: Difficulty) => void; onBack: () => void; pending: boolean; error: string }) {
  const [callsign, setCallsign] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [invalid, setInvalid] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = callsign.trim().toUpperCase();
    if (!/^[A-Z0-9 _-]{1,16}$/.test(name)) { setInvalid(true); return; }
    setInvalid(false); onStart(name, difficulty);
  }
  return <section className="setup-screen"><div className="setup-scene" aria-hidden="true"><span className="setup-district">NEW ORLEANS / AFTER HOURS</span><img src="/assets/intro/rathbone/full-body.webp" alt=""/><span className="setup-sewer">ENTER AT YOUR OWN RISK</span></div><form className="setup-panel" onSubmit={submit}><button className="text-button" type="button" onClick={onBack}>‹ Back to menu</button><span className="kicker">Municipal enrollment / No account needed</span><h1>Who&apos;s on rat duty?</h1><p>Put a name on the score board. Then choose how unpleasant the tunnel gets.</p><label className="field-label" htmlFor="callsign">Callsign</label><input id="callsign" autoComplete="off" spellCheck={false} maxLength={16} value={callsign} onChange={event => { setCallsign(event.target.value); setInvalid(false); }} placeholder="YOUR CALLSIGN" aria-invalid={invalid} /><small>1–16 letters, numbers, spaces, _ or -</small>{invalid && <p role="alert" className="form-error">Enter a callsign using the allowed characters.</p>}
    <fieldset><legend>Difficulty</legend><div className="difficulty-row">{(Object.keys(DIFFICULTIES) as Difficulty[]).map(key => <button type="button" key={key} className={difficulty === key ? "selected" : ""} aria-pressed={difficulty === key} onClick={() => setDifficulty(key)}>{DIFFICULTIES[key].label}<small>{key === "easy" ? "Guide on" : key === "medium" ? "Standard" : "Quick rats"}</small></button>)}</div></fieldset>
    <div className="setup-loadout"><span className="kicker">Issued equipment</span><div>{Object.values(CHICKENS).map(chicken => <span key={chicken.id}><img src={chicken.asset} alt=""/><b>{chicken.label}</b></span>)}</div><small>Pull a chicken back to launch. Four Mood Basket cats give you a wider blast.</small></div>
    {error && <p role="alert" className="form-error">{error}</p>}<button className="primary-button" type="submit" disabled={pending}>{pending ? "Opening the tunnel..." : "Enter the rat tunnel"}<span aria-hidden="true">›</span></button></form></section>;
}
