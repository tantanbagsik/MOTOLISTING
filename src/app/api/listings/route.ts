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
    const cookieHeader = request.headers.get("cookie");
    const sessionMatch = cookieHeader?.match(/user_session=([^;]+)/);

    if (!sessionMatch) {
      return NextResponse.json(
        { error: "Please login to create a listing" },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(decodeURIComponent(sessionMatch[1]));
    const userId = sessionData.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Please login to create a listing" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body.make || !body.model || !body.year || !body.price || !body.priceType) {
      return NextResponse.json(
        { error: "Make, model, year, price, and listing type are required" },
        { status: 400 }
      );
    }

    const title = `${body.year} ${body.make} ${body.model}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        title,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        price: parseFloat(body.price),
        priceType: body.priceType,
        mileage: body.mileage ? parseInt(body.mileage) : null,
        color: body.color || null,
        transmission: body.transmission || null,
        engine: body.engine || null,
        fuelType: body.fuelType || null,
        condition: body.condition || null,
        description: body.description || null,
        images: body.images || [],
        listingStatus: "pending",
        sellerId: user.id,
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
