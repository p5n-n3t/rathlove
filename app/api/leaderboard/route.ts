import { NextResponse, type NextRequest } from "next/server";
import { arcadeDb } from "@/src/server/supabase";
import { isDifficulty } from "@/src/game/systems/rules";

export async function GET(request: NextRequest) {
  const selected = request.nextUrl.searchParams.get("difficulty");
  if (selected !== "all" && !isDifficulty(selected)) return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  try {
    let query = arcadeDb().from("scores").select("id,callsign,difficulty,score,hits,shots,accuracy,created_at").order("score", { ascending: false }).order("created_at", { ascending: true }).limit(10);
    if (selected !== "all") query = query.eq("difficulty", selected);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Leaderboard unavailable" }, { status: 503 }); }
}
