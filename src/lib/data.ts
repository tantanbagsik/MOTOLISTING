import { prisma } from './prisma';

export async function getVehicles(priceType?: string) {
  const where = priceType ? { priceType } : {};
  return await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVehicleById(id: string) {
  return await prisma.vehicle.findUnique({
    where: { id },
    include: { seller: true },
  });
}

export async function getVehicleLocations() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      locations: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });
  return vehicles.filter(v => v.locations.length > 0).map(v => ({
    ...v,
    location: v.locations[0],
  }));
}

export async function getSalesSummary() {
  const soldVehicles = await prisma.vehicle.findMany({
    where: { status: 'sold' },
  });
  return {
    totalSold: soldVehicles.length,
    totalRevenue: soldVehicles.reduce((sum, v) => sum + v.price, 0),
  };
}
