import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const vehicles = await prisma.vehicle.findMany();

  for (const vehicle of vehicles) {
    const lat = 34.0522 + (Math.random() - 0.5) * 0.05;
    const lng = -118.2437 + (Math.random() - 0.5) * 0.05;
    const speed = Math.floor(Math.random() * 80);

    await prisma.vehicleLocation.create({
      data: {
        vehicleId: vehicle.id,
        latitude: lat,
        longitude: lng,
        speed: speed,
        timestamp: new Date(),
      },
    });

    console.log(`Added location for ${vehicle.make} ${vehicle.model}`);
  }

  console.log('Vehicle locations seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
