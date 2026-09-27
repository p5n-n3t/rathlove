import { randomInt, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { arcadeDb } from "@/src/server/supabase";
import { isDifficulty } from "@/src/game/systems/rules";

export async function POST(request: NextRequest) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const input = body as { callsign?: unknown; difficulty?: unknown };
  const callsign = typeof input?.callsign === "string" ? input.callsign.trim().toUpperCase() : "";
  if (!/^[A-Z0-9 _-]{1,16}$/.test(callsign) || !isDifficulty(input?.difficulty)) return NextResponse.json({ error: "Use a 1–16 character callsign and choose a difficulty" }, { status: 400 });
  try {
    const db = arcadeDb();
    const cookieStore = await cookies();
    const previous = cookieStore.get("arcade_player")?.value;
    const playerId = previous && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(previous) ? previous : randomUUID();
    const { error: playerError } = await db.from("arcade_players").upsert({ id: playerId, last_seen_at: new Date().toISOString() }, { onConflict: "id" });
    if (playerError) throw playerError;
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await db.from("game_sessions").select("id", { head: true, count: "exact" }).eq("player_id", playerId).gte("started_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= 12) return NextResponse.json({ error: "Round limit reached. Try again later." }, { status: 429 });
    const seed = randomInt(1, 2147483647);
    const bonusTimes = [randomInt(18, 37), randomInt(57, 77)];
    const { data, error } = await db.from("game_sessions").insert({ player_id: playerId, callsign, difficulty: input.difficulty, seed, bonus_seconds: bonusTimes }).select("id,started_at").single();
    if (error) throw error;
    const response = NextResponse.json({ id: data.id, seed, bonusTimes, startedAt: data.started_at });
    response.cookies.set("arcade_player", playerId, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch { return NextResponse.json({ error: "Could not start a round. Try again." }, { status: 503 }); }
}
