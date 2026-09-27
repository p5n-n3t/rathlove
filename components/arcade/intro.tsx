"use client";

import { useEffect, useState } from "react";
import assets from "@/src/data/assets.json";

const chapters = [
  { at: 0, title: "SIGNAL ACQUIRED", line: "Municipal vermin control / New Orleans district", detail: "BOOT SEQUENCE 00" },
  { at: 10, title: "THE CITY IS HUNGRY", line: "First they took the gumbo. Then the grocery stores. Then the groceries inside the stores.", detail: "INCIDENT REPORT 01" },
  { at: 23, title: "INFESTATION: IMPOLITE", line: "The balconies are shaking. The cats have filed formal complaints.", detail: "STREET CAMERA 02" },
  { at: 36, title: "HELP WANTED", line: "One man. Three chickens. An extremely questionable contract.", detail: "CLASSIFIED NOTICE 03" },
  { at: 49, title: "RATHBONE ACCEPTS", line: "Also known as Rathlove. Payment requested in cash and novelty watches.", detail: "PERSONNEL FILE 04" },
  { at: 62, title: "THE CATS OBJECT", line: "The Mood Basket has requested a place on the team.", detail: "UNSOLICITED MEMO 05" },
  { at: 75, title: "DOWN BELOW", line: "Four ratways. Ninety seconds. No refunds.", detail: "TUNNEL ACCESS 06" },
  { at: 85, title: "RATH-A-MOLE", line: "An unlikely solution to an extremely likely problem.", detail: "INSERT COIN 07" },
];

export function Intro({ onSkip }: { onSkip: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { const begun = performance.now(); const timer = window.setInterval(() => { const seconds = Math.floor((performance.now() - begun) / 1000); setElapsed(seconds); if (seconds >= 90) { window.clearInterval(timer); onSkip(); } }, 200); return () => window.clearInterval(timer); }, [onSkip]);
  const chapterIndex = Math.max(0, chapters.findLastIndex(chapter => elapsed >= chapter.at));
  const chapter = chapters[chapterIndex];
  const graffiti = assets.intro.graffiti[Math.floor(elapsed / 6) % assets.intro.graffiti.length];
  const nextGraffiti = assets.intro.graffiti[(Math.floor(elapsed / 6) + 3) % assets.intro.graffiti.length];
  const portrait = assets.intro.rathbone[5 + Math.floor(elapsed / 2) % 5];
  const hero = assets.intro.rathbone[Math.floor(Math.max(0, elapsed - 36) / 3) % 10];
  const icon = assets.intro.icons[Math.floor(elapsed / 3) % assets.intro.icons.length];
  const prop = assets.intro.props[Math.floor(elapsed / 5) % assets.intro.props.length];
  const lips = assets.intro.lips[Math.floor(elapsed / 2) % assets.intro.lips.length];
  const pixelLogo = assets.intro.logos.pixelatedIcons[Math.floor(elapsed / 4) % 3];
  return (
    <section className="intro-screen" aria-label="Opening cinematic">
      <div className={`intro-city intro-city-${chapterIndex}`} aria-hidden="true">
        <div className="city-building city-building-a"><span className="building-sign">DUMAINE / MARKET</span><img src={graffiti} alt="" className="wall-graffiti" /></div>
        <div className="city-building city-building-b"><span className="balcony" /><span className="building-sign">OPEN 24 HOURS</span><img src={nextGraffiti} alt="" className="wall-graffiti wall-graffiti-two" /></div>
        <div className="city-building city-building-c"><span className="balcony" /><span className="building-sign">CANAL ST.</span></div>
        <div className="city-street"><span className="road-mark"/><span className="city-car"/></div>
        <div className="city-rat city-rat-one"/><div className="city-rat city-rat-two"/><div className="city-steam"/>
      </div>
      <div className="intro-broadcast" aria-hidden="true"><span>ON AIR / CHANNEL 04</span><img src={prop} alt=""/><span>SPONSORED BY THE CITY</span></div>
      <img src={pixelLogo} alt="" className="intro-pixel-icon" aria-hidden="true" />
      <div className={`intro-art intro-art-${chapterIndex}`} aria-hidden="true">
        {chapterIndex === 0 && <img src={assets.intro.props[1]} alt="" className="intro-prop" />}
        {(chapterIndex === 1 || chapterIndex === 2) && <><img src={chapterIndex === 2 ? assets.intro.props[7] : assets.intro.props[9]} alt="" className="intro-hero"/><img src={assets.intro.props[3]} alt="" className="intro-cat intro-fly" /></>}
        {chapterIndex === 3 && <><img src={portrait} alt="" className="intro-hero"/><img src={lips} alt="" className="intro-lips" /></>}
        {chapterIndex === 4 && <><img src={hero} alt="" className="intro-hero"/><img src={assets.intro.logos.mainRathboneKoosh} alt="" className="intro-koosh" /></>}
        {chapterIndex === 5 && <><img src={assets.intro.props[8]} alt="" className="intro-hero"/><img src={assets.intro.props[7]} alt="" className="intro-cat"/><img src={hero} alt="" className="intro-mini-hero" /></>}
        {chapterIndex === 6 && <><img src={assets.intro.rathbone[4]} alt="" className="intro-hero intro-descend"/><img src={lips} alt="" className="intro-lips" /></>}
        {chapterIndex === 7 && <div className="intro-title-lock"><img src={assets.intro.logos.mainRathboneKoosh} alt=""/><img src={assets.intro.lips[0]} alt=""/><img src={assets.intro.logos.mainRathloveBlockCharacters} alt=""/><img src={assets.intro.lips[1]} alt=""/></div>}
      </div>
      <div className="intro-caption" key={chapterIndex}>
        <span className="kicker"><img src={icon} alt="" /> {chapter.detail} / {String(elapsed).padStart(2, "0")}:90</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.line}</p>
        <span className="caption-cursor" aria-hidden="true">▮</span>
      </div>
      <div className="intro-bottom"><div className="cinematic-progress"><span style={{ width: `${Math.min(100, elapsed / 90 * 100)}%` }} /></div><button type="button" className="text-button" onClick={onSkip}>Skip intro <span aria-hidden="true">›</span></button></div>
    </section>
  );
}
