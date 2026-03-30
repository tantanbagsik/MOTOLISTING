import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        title: body.title,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        price: parseFloat(body.price),
        priceType: body.priceType,
        mileage: body.mileage ? parseInt(body.mileage) : null,
        color: body.color,
        transmission: body.transmission,
        engine: body.engine,
        fuelType: body.fuelType,
        condition: body.condition,
        description: body.description,
        images: body.images || [],
        listingStatus: "pending", // Reset to pending on edit
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Failed to update listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vehicle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Failed to delete listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
