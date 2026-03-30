import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing records in correct order
  await prisma.vehicleLocation.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin user
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@raypanganiban.tech',
      phone: '+63 999 888 7777',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
    },
  });

  // Create seller users
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ray Panganiban Technology',
        email: 'raypanganiban0825@gmail.com',
        phone: '09564804965',
        password: hashedPassword,
        role: 'seller',
        provider: 'credentials',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        phone: '+63 912 345 6789',
        password: hashedPassword,
        role: 'seller',
        provider: 'credentials',
      },
    }),
  ]);

  // Create vehicles with Philippine market prices
  const vehicles = [
    {
      title: 'Toyota Camry 2024',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      price: 2150000,
      priceType: 'sale',
      mileage: 5000,
      color: 'Pearl White',
      transmission: 'Automatic',
      engine: '2.5L 4-Cylinder',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Experience the perfect blend of elegance and performance with the 2024 Toyota Camry.',
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Honda Civic 2023',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      price: 3500,
      priceType: 'rent',
      mileage: 25000,
      color: 'Sonic Gray',
      transmission: 'Automatic',
      engine: '1.5L Turbo',
      fuelType: 'Petrol',
      condition: 'Used',
      description: 'Reliable and fuel-efficient Honda Civic available for daily rental.',
      images: ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Tesla Model 3 2024',
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 3850000,
      priceType: 'installment',
      mileage: 1000,
      color: 'Midnight Silver',
      transmission: 'Automatic',
      engine: 'Dual Motor',
      fuelType: 'Electric',
      condition: 'New',
      description: 'Premium electric sedan with autopilot features available on installment.',
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'BMW 3 Series 2023',
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      price: 3850000,
      priceType: 'sale',
      mileage: 15000,
      color: 'Alpine White',
      transmission: 'Automatic',
      engine: '3.0L Inline-6',
      fuelType: 'Petrol',
      condition: 'Used',
      description: 'Luxury sports sedan with premium features and performance.',
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Mercedes C-Class 2024',
      make: 'Mercedes',
      model: 'C-Class',
      year: 2024,
      price: 4250000,
      priceType: 'sale',
      mileage: 3000,
      color: 'Obsidian Black',
      transmission: 'Automatic',
      engine: '2.0L Turbo',
      fuelType: 'Diesel',
      condition: 'New',
      description: 'Executive luxury sedan with cutting-edge technology.',
      images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Audi A4 2023',
      make: 'Audi',
      model: 'A4',
      year: 2023,
      price: 2850000,
      priceType: 'installment',
      mileage: 20000,
      color: 'Navarra Blue',
      transmission: 'Automatic',
      engine: '2.0L TFSI',
      fuelType: 'Petrol',
      condition: 'Used',
      description: 'German engineering excellence available on easy installment plans.',
      images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Toyota Fortuner 2024',
      make: 'Toyota',
      model: 'Fortuner',
      year: 2024,
      price: 1850000,
      priceType: 'sale',
      mileage: 8000,
      color: 'Attitude Black',
      transmission: 'Automatic',
      engine: '2.8L Diesel',
      fuelType: 'Diesel',
      condition: 'New',
      description: 'Rugged and reliable SUV for the Filipino family.',
      images: ['https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800'],
      listingStatus: 'pending',
    },
    {
      title: 'Mitsubishi Montero Sport 2024',
      make: 'Mitsubishi',
      model: 'Montero Sport',
      year: 2024,
      price: 4500,
      priceType: 'rent',
      mileage: 18000,
      color: 'Titanium Gray',
      transmission: 'Automatic',
      engine: '2.4L Diesel',
      fuelType: 'Diesel',
      condition: 'Used',
      description: 'Powerful SUV available for rent with driver or self-drive.',
      images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'],
      listingStatus: 'pending',
    },
  ];

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    const seller = sellers[i % sellers.length];
    const created = await prisma.vehicle.create({
      data: {
        ...vehicle,
        sellerId: seller.id,
        approvedAt: vehicle.listingStatus === 'approved' ? new Date() : null,
      },
    });
    console.log(`Created: ${vehicle.make} ${vehicle.model} - ₱${vehicle.price.toLocaleString()} (${vehicle.listingStatus})`);

    // Add location for some vehicles (Metro Manila area)
    if (i < 4) {
      const lat = 14.5995 + (Math.random() - 0.5) * 0.1;
      const lng = 120.9842 + (Math.random() - 0.5) * 0.1;
      const speed = Math.floor(Math.random() * 80);

      await prisma.vehicleLocation.create({
        data: {
          vehicleId: created.id,
          latitude: lat,
          longitude: lng,
          speed: speed,
          timestamp: new Date(),
        },
      });
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('📧 Admin: admin@raypanganiban.tech / password123');
  console.log('📧 Seller: raypanganiban0825@gmail.com / password123');
  console.log('📧 Seller: juan@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
