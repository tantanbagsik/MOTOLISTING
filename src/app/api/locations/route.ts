import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const locations = await prisma.vehicleLocation.findMany({
    orderBy: { timestamp: 'desc' },
    include: {
      vehicle: { select: { id: true, make: true, model: true, year: true } },
    },
    take: 50,
  });

  const latestByVehicle = locations.reduce((acc: any[], loc) => {
    if (!acc.find(a => a.vehicleId === loc.vehicleId)) {
      acc.push(loc);
    }
    return acc;
  }, []);

  return NextResponse.json(latestByVehicle);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const location = await prisma.vehicleLocation.create({
    data: {
      vehicleId: body.vehicleId,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      speed: parseFloat(body.speed || 0),
      timestamp: new Date(),
    },
  });

  return NextResponse.json(location);
}
