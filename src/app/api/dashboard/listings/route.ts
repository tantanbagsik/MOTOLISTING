import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const sessionToken = request.headers.get("cookie")?.match(/next-auth\.session-token=([^;]+)/)?.[1];

    // For now, return all listings (we'll add auth later)
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
