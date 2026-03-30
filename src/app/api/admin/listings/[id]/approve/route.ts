import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        listingStatus: "approved",
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Listing approved successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Failed to approve listing:", error);
    return NextResponse.json(
      { error: "Failed to approve listing" },
      { status: 500 }
    );
  }
}
