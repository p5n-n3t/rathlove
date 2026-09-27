"use client";

import { Leaderboard } from "./leaderboard";

export function Menu({ onStart, onOptions, onHelp, onLeaderboard, onReplayIntro }: { onStart: () => void; onOptions: () => void; onHelp: () => void; onLeaderboard: () => void; onReplayIntro: () => void }) {
  return <section className="menu-screen">
    <div className="menu-world" aria-hidden="true"><span className="city-sign">RATHBONE&apos;S / MUNICIPAL VERMIN DIVISION</span><span className="manhole">TUNNEL 04</span></div>
    <div className="menu-main"><div className="menu-hero"><span className="kicker">A lost arcade transmission from RATLOVE.ME</span><img src="/assets/intro/logos/main-logo-rathbone-in-koosh.webp" alt="Rathbone" className="koosh-logo"/><span className="title-in">IN</span><img src="/assets/intro/logos/main-logo-rathlove-block-characters.webp" alt="Rathlove" className="rathlove-logo"/><h1>RATH-A-MOLE</h1><p>One city. Four ratways. A poultry-based solution.</p><div className="menu-actions"><button className="primary-button" type="button" onClick={onStart}>Start game <span aria-hidden="true">›</span></button><div className="menu-secondary"><button type="button" onClick={onLeaderboard}>Leaderboard</button><button type="button" onClick={onOptions}>Options</button><button type="button" onClick={onHelp}>Help</button></div></div></div><div className="menu-records"><Leaderboard compact /></div></div>
    <footer className="cabinet-footer"><span>© RATLOVE.ME / QUARTERS NOT REQUIRED</span><button type="button" className="text-button" onClick={onReplayIntro}>Replay cinematic</button><span>PRESS START TO DESCEND</span></footer>
  </section>;
}
