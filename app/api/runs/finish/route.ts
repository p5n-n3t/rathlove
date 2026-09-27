import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { arcadeDb } from "@/src/server/supabase";
import { isDifficulty, validateRun, type RunEvent } from "@/src/game/systems/rules";

export async function POST(request: NextRequest) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 100000) return NextResponse.json({ error: "Run log too large" }, { status: 413 });
  let input: { id?: unknown; events?: unknown };
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid run" }, { status: 400 }); }
  if (typeof input?.id !== "string" || !/^[\da-f-]{36}$/i.test(input.id) || !Array.isArray(input.events)) return NextResponse.json({ error: "Invalid run" }, { status: 400 });
  const playerId = (await cookies()).get("arcade_player")?.value;
  if (!playerId) return NextResponse.json({ error: "This round belongs to another browser" }, { status: 403 });
  try {
    const db = arcadeDb();
    const { data: session, error } = await db.from("game_sessions").select("id,player_id,difficulty,seed,bonus_seconds,started_at,consumed").eq("id", input.id).eq("player_id", playerId).single();
    if (error || !session || session.consumed || !isDifficulty(session.difficulty)) return NextResponse.json({ error: "Round unavailable or already filed" }, { status: 409 });
    const elapsed = Date.now() - new Date(session.started_at).getTime();
    if (elapsed < 89000 || elapsed > 240000) return NextResponse.json({ error: "Round has not finished or has expired" }, { status: 409 });
    let totals;
    try { totals = validateRun(input.events as RunEvent[], session.seed, session.difficulty, session.bonus_seconds); }
    catch { return NextResponse.json({ error: "Run log did not pass validation" }, { status: 422 }); }
    const { data: scoreId, error: finishError } = await db.rpc("complete_arcade_run", { p_session_id: session.id, p_player_id: playerId, p_score: totals.score, p_hits: totals.hits, p_shots: totals.shots, p_best_combo: totals.bestCombo, p_events: input.events });
    if (finishError) return NextResponse.json({ error: "Run could not be filed" }, { status: 409 });
    const { count } = await db.from("scores").select("id", { head: true, count: "exact" }).gt("score", totals.score);
    return NextResponse.json({ scoreId, rank: (count ?? 0) + 1, ...totals });
  } catch { return NextResponse.json({ error: "Score service unavailable. Retry from results." }, { status: 503 }); }
}
