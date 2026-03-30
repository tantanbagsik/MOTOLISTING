import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const priceType = searchParams.get('priceType');
  
  const where = priceType ? { priceType } : {};
  
  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { seller: { select: { name: true, phone: true, email: true } } },
  });

  return NextResponse.json(vehicles);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const vehicle = await prisma.vehicle.create({
    data: {
      title: `${body.make} ${body.model}`,
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
      images: JSON.stringify(body.images || []),
      sellerId: body.sellerId,
      status: 'available',
    },
  });

  return NextResponse.json(vehicle);
}
