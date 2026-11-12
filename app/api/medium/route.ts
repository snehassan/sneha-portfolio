import { NextResponse } from "next/server";
import { getMediumArticles } from "@/lib/medium";

// Live Medium feed for the static Stack Overfit page. Refreshed hourly.
export const revalidate = 3600;

export async function GET() {
  const articles = await getMediumArticles(20);
  return NextResponse.json(
    { articles },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
