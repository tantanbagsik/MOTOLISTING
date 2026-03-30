import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const priceType = searchParams.get("priceType");
    const status = searchParams.get("status") || "approved";

    const where: any = {};
    if (status !== "all") {
      where.listingStatus = status;
    }
    if (priceType) where.priceType = priceType;

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { name: true, email: true, phone: true },
        },
      },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the first user (or create a default seller)
    let seller = await prisma.user.findFirst({
      where: { role: "seller" },
    });

    if (!seller) {
      // Create default seller if none exists
      seller = await prisma.user.create({
        data: {
          name: "Default Seller",
          email: "seller@example.com",
          password: "default123",
          role: "seller",
          provider: "credentials",
        },
      });
    }

    const vehicle = await prisma.vehicle.create({
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
        listingStatus: "pending", // Requires admin approval
        sellerId: seller.id,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
