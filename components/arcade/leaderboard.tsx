"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Difficulty } from "@/src/game/systems/rules";

type Row = { id: string; callsign: string; difficulty: Difficulty; score: number; accuracy: number };
const fetcher = async (url: string): Promise<Row[]> => { const response = await fetch(url); if (!response.ok) throw new Error("Leaderboard unavailable"); return response.json(); };

export function Leaderboard({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const { data, error, isLoading, mutate } = useSWR(`/api/leaderboard?difficulty=${filter}`, fetcher, { refreshInterval: 30000 });
  return <section className={`leaderboard ${compact ? "leaderboard-compact" : ""}`} aria-label="Leaderboard">
    <div className="panel-heading"><div><span className="kicker">Municipal records</span><h2>High scores</h2></div><button className="text-button" type="button" onClick={() => void mutate()} aria-label="Refresh leaderboard">Refresh ↻</button></div>
    <div className="filter-row" role="group" aria-label="Filter leaderboard by difficulty">{(["all", "easy", "medium", "hard"] as const).map(value => <button type="button" key={value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}</button>)}</div>
    <div className="score-table"><div className="score-row score-header"><span>#</span><span>Callsign</span><span>Mode</span><span>Score</span></div>
      {data?.map((row, index) => <div className="score-row" key={row.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{row.callsign}</strong><span>{row.difficulty}</span><b>{row.score.toLocaleString()}</b></div>)}
      {isLoading && <p className="table-message">Tuning in to municipal records...</p>}
      {error && <p className="table-message">Signal lost. Refresh to try again.</p>}
      {data?.length === 0 && <p className="table-message">No scores filed yet. Be the first to enter the tunnel.</p>}
    </div>
  </section>;
}
