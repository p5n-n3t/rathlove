"use client";

export type ArcadeOptions = { master: number; music: number; effects: number; sensitivity: number; motion: number };
export const defaultOptions: ArcadeOptions = { master: 65, music: 45, effects: 70, sensitivity: 65, motion: 1 };

export function OptionsPanel({ values, onChange, onBack }: { values: ArcadeOptions; onChange: (next: ArcadeOptions) => void; onBack: () => void }) {
  const sliders = [
    { key: "master", label: "Master volume", min: 0, max: 100 },
    { key: "music", label: "Music", min: 0, max: 100 },
    { key: "effects", label: "Sound effects", min: 0, max: 100 },
    { key: "sensitivity", label: "Input sensitivity", min: 20, max: 100 },
  ] as const;
  return <section className="subscreen" aria-label="Options"><div className="subscreen-head"><button className="text-button" onClick={onBack}>‹ Back</button><span className="kicker">Control room / 02</span></div><h1>Options</h1><p>Make the tunnel comfortable before you enter.</p><div className="settings-list">{sliders.map(slider => <label className="setting-row" key={slider.key}><span>{slider.label}</span><input type="range" min={slider.min} max={slider.max} value={values[slider.key]} onChange={event => onChange({ ...values, [slider.key]: Number(event.target.value) })} /><output>{values[slider.key]}%</output></label>)}<label className="setting-row"><span>Reduced motion</span><input type="checkbox" checked={values.motion === 0} onChange={event => onChange({ ...values, motion: event.target.checked ? 0 : 1 })}/></label></div><p className="setting-note">Sound begins only after you interact with the game. The intro is always skippable.</p></section>;
}
