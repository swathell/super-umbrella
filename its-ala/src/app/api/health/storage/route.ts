import { NextResponse } from "next/server";
import { getStorageHealth } from "@/lib/storage-health";

export async function GET() {
  const health = await getStorageHealth();
  const status = health.mode === "postgres" && !health.postgresReachable ? 503 : 200;
  return NextResponse.json(health, { status });
}
