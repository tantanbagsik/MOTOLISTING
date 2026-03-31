import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const sessionMatch = cookieHeader?.match(/user_session=([^;]+)/);

    if (!sessionMatch) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(decodeURIComponent(sessionMatch[1]));
    const userId = sessionData.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { sellerId: userId },
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
