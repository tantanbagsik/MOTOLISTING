import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing records in correct order
  await prisma.reminder.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.vehicleLocation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin user
  const admin = await prisma.user.create({
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
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '+63 917 555 1234',
        password: hashedPassword,
        role: 'seller',
        provider: 'credentials',
      },
    }),
  ]);

  // Create a buyer user for bookings and inquiries
  const buyer = await prisma.user.create({
    data: {
      name: 'Carlos Reyes',
      email: 'carlos@example.com',
      phone: '+63 918 777 8888',
      password: hashedPassword,
      role: 'buyer',
      provider: 'credentials',
    },
  });

  // Create vehicles with Philippine market prices
  const vehicles = [
    // === FOR SALE VEHICLES ===
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
      listingStatus: 'approved',
    },
    {
      title: 'Ford Mustang 2024',
      make: 'Ford',
      model: 'Mustang',
      year: 2024,
      price: 4500000,
      priceType: 'sale',
      mileage: 2000,
      color: 'Race Red',
      transmission: 'Manual',
      engine: '5.0L V8',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Iconic American muscle car with raw power and head-turning design.',
      images: ['https://images.unsplash.com/photo-1584345604476-8ec5f82d71f2?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Mazda CX-5 2024',
      make: 'Mazda',
      model: 'CX-5',
      year: 2024,
      price: 1950000,
      priceType: 'sale',
      mileage: 6000,
      color: 'Soul Red Crystal',
      transmission: 'Automatic',
      engine: '2.5L Skyactiv-G',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Premium compact SUV with sporty handling and elegant design.',
      images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Hyundai Tucson 2023',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2023,
      price: 1750000,
      priceType: 'sale',
      mileage: 12000,
      color: 'Phantom Black',
      transmission: 'Automatic',
      engine: '2.0L CRDi',
      fuelType: 'Diesel',
      condition: 'Used',
      description: 'Feature-packed SUV with bold styling and advanced safety tech.',
      images: ['https://images.unsplash.com/photo-1633695610498-eca4ba22c5d4?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Nissan Navara 2024',
      make: 'Nissan',
      model: 'Navara',
      year: 2024,
      price: 1650000,
      priceType: 'sale',
      mileage: 4000,
      color: 'Galaxy Black',
      transmission: 'Automatic',
      engine: '2.5L Diesel Turbo',
      fuelType: 'Diesel',
      condition: 'New',
      description: 'Tough and capable pickup truck for work and adventure.',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Subaru Forester 2023',
      make: 'Subaru',
      model: 'Forester',
      year: 2023,
      price: 2100000,
      priceType: 'sale',
      mileage: 10000,
      color: 'Horizon Blue',
      transmission: 'Automatic',
      engine: '2.5L Boxer',
      fuelType: 'Petrol',
      condition: 'Used',
      description: 'All-wheel drive SUV with symmetrical AWD for all conditions.',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
      listingStatus: 'pending',
    },
    {
      title: 'Geely Coolray 2024',
      make: 'Geely',
      model: 'Coolray',
      year: 2024,
      price: 1250000,
      priceType: 'sale',
      mileage: 1500,
      color: 'Flame Red',
      transmission: 'Automatic',
      engine: '1.5L Turbo',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Feature-rich subcompact SUV with turbocharged performance.',
      images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'],
      listingStatus: 'pending',
    },

    // === FOR RENT VEHICLES ===
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
      listingStatus: 'approved',
    },
    {
      title: 'Toyota Vios 2024',
      make: 'Toyota',
      model: 'Vios',
      year: 2024,
      price: 2500,
      priceType: 'rent',
      mileage: 8000,
      color: 'Red Mica',
      transmission: 'Automatic',
      engine: '1.5L Dual VVT-i',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Affordable and reliable sedan perfect for city driving.',
      images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Toyota Hi-Ace 2023',
      make: 'Toyota',
      model: 'Hi-Ace',
      year: 2023,
      price: 6000,
      priceType: 'rent',
      mileage: 35000,
      color: 'White',
      transmission: 'Manual',
      engine: '2.8L Diesel',
      fuelType: 'Diesel',
      condition: 'Used',
      description: 'Spacious van ideal for group travel and airport transfers.',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Ford Everest 2024',
      make: 'Ford',
      model: 'Everest',
      year: 2024,
      price: 5000,
      priceType: 'rent',
      mileage: 5000,
      color: 'Meteor Grey',
      transmission: 'Automatic',
      engine: '2.0L Bi-Turbo',
      fuelType: 'Diesel',
      condition: 'New',
      description: 'Premium SUV with advanced 4x4 capability for any terrain.',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Toyota Innova 2023',
      make: 'Toyota',
      model: 'Innova',
      year: 2023,
      price: 3800,
      priceType: 'rent',
      mileage: 22000,
      color: 'Silver Metallic',
      transmission: 'Automatic',
      engine: '2.8L Diesel',
      fuelType: 'Diesel',
      condition: 'Used',
      description: 'Versatile MPV perfect for family trips and long drives.',
      images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Hyundai Stargazer 2024',
      make: 'Hyundai',
      model: 'Stargazer',
      year: 2024,
      price: 3200,
      priceType: 'rent',
      mileage: 3000,
      color: 'Creamy White',
      transmission: 'Automatic',
      engine: '1.5L MPI',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Modern MPV with spacious interior and fuel efficiency.',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Suzuki Ertiga 2023',
      make: 'Suzuki',
      model: 'Ertiga',
      year: 2023,
      price: 2800,
      priceType: 'rent',
      mileage: 15000,
      color: 'Magma Grey',
      transmission: 'Automatic',
      engine: '1.5L K15B',
      fuelType: 'Petrol',
      condition: 'Used',
      description: 'Budget-friendly 7-seater MPV with excellent fuel economy.',
      images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'],
      listingStatus: 'pending',
    },

    // === INSTALLMENT VEHICLES ===
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
      title: 'Toyota Corolla Cross 2024',
      make: 'Toyota',
      model: 'Corolla Cross',
      year: 2024,
      price: 1650000,
      priceType: 'installment',
      mileage: 2000,
      color: 'Platinum White',
      transmission: 'Automatic',
      engine: '1.8L Hybrid',
      fuelType: 'Hybrid',
      condition: 'New',
      description: 'Fuel-efficient hybrid SUV with flexible installment options.',
      images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Honda HR-V 2024',
      make: 'Honda',
      model: 'HR-V',
      year: 2024,
      price: 1550000,
      priceType: 'installment',
      mileage: 3500,
      color: 'Ignite Red',
      transmission: 'Automatic',
      engine: '1.5L VTEC Turbo',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Stylish subcompact SUV with versatile cargo space.',
      images: ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Kia Seltos 2024',
      make: 'Kia',
      model: 'Seltos',
      year: 2024,
      price: 1400000,
      priceType: 'installment',
      mileage: 1800,
      color: 'Gravity Grey',
      transmission: 'Automatic',
      engine: '1.5L Smartstream',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Bold and practical subcompact SUV with modern tech features.',
      images: ['https://images.unsplash.com/photo-1633695610498-eca4ba22c5d4?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Mazda 3 Sedan 2024',
      make: 'Mazda',
      model: '3 Sedan',
      year: 2024,
      price: 1600000,
      priceType: 'installment',
      mileage: 4500,
      color: 'Machine Grey',
      transmission: 'Automatic',
      engine: '2.0L Skyactiv-G',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Premium compact sedan with refined handling and upscale interior.',
      images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'BYD Atto 3 2024',
      make: 'BYD',
      model: 'Atto 3',
      year: 2024,
      price: 1800000,
      priceType: 'installment',
      mileage: 500,
      color: 'Parkour Green',
      transmission: 'Automatic',
      engine: 'Electric Motor',
      fuelType: 'Electric',
      condition: 'New',
      description: 'Affordable electric SUV with impressive range and features.',
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
      listingStatus: 'approved',
    },
    {
      title: 'Changan CS55 Plus 2024',
      make: 'Changan',
      model: 'CS55 Plus',
      year: 2024,
      price: 1300000,
      priceType: 'installment',
      mileage: 1200,
      color: 'Crystal Black',
      transmission: 'Automatic',
      engine: '1.5L Turbo',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Feature-packed Chinese SUV with premium feel at affordable price.',
      images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'],
      listingStatus: 'pending',
    },
    {
      title: 'Mitsubishi Xpander 2024',
      make: 'Mitsubishi',
      model: 'Xpander',
      year: 2024,
      price: 1200000,
      priceType: 'installment',
      mileage: 2500,
      color: 'Sterling Silver',
      transmission: 'Automatic',
      engine: '1.5L MIVEC',
      fuelType: 'Petrol',
      condition: 'New',
      description: 'Popular 7-seater MPV with flexible payment options.',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
      listingStatus: 'pending',
    },
  ];

  const createdVehicles: any[] = [];

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
    createdVehicles.push(created);
    console.log(`Created: ${vehicle.make} ${vehicle.model} - ₱${vehicle.price.toLocaleString()} (${vehicle.priceType}) [${vehicle.listingStatus}]`);

    // Add location for approved vehicles (Metro Manila area)
    if (vehicle.listingStatus === 'approved') {
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

  // Get rent vehicles for bookings
  const rentVehicles = createdVehicles.filter(v => v.priceType === 'rent');
  const saleVehicles = createdVehicles.filter(v => v.priceType === 'sale');
  const installmentVehicles = createdVehicles.filter(v => v.priceType === 'installment');

  // Create sample bookings for rental vehicles
  const bookings: any[] = [];
  for (let i = 0; i < Math.min(rentVehicles.length, 5); i++) {
    const vehicle = rentVehicles[i];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1);
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = vehicle.price * durationDays;

    const booking = await prisma.booking.create({
      data: {
        vehicleId: vehicle.id,
        userId: buyer.id,
        startDate: startDate,
        endDate: endDate,
        pickupTime: '10:00',
        returnTime: '10:00',
        duration: `${durationDays} days`,
        pickupLocation: ['Main Office - 123 Main St', 'Airport Branch - Terminal 2', 'Downtown - 456 Center Ave'][i % 3],
        totalPrice: totalPrice,
        status: i < 3 ? 'confirmed' : 'pending',
        agreementSigned: i < 3,
      },
    });
    bookings.push(booking);
    console.log(`Booking created: ${vehicle.make} ${vehicle.model} - ₱${totalPrice.toLocaleString()} (${booking.status})`);
  }

  // Create reminders for confirmed bookings
  for (const booking of bookings.filter(b => b.status === 'confirmed')) {
    const pickupTime = new Date(booking.startDate);
    const reminder24h = new Date(pickupTime.getTime() - 24 * 60 * 60 * 1000);
    const reminder1h = new Date(pickupTime.getTime() - 60 * 60 * 1000);

    await prisma.reminder.createMany({
      data: [
        { bookingId: booking.id, type: 'email', scheduledFor: reminder24h, sent: false },
        { bookingId: booking.id, type: 'email', scheduledFor: reminder1h, sent: false },
      ],
    });
    console.log(`Reminders created for booking ${booking.id}`);
  }

  // Create sample inquiries
  const inquiryMessages = [
    { message: 'Is this vehicle still available?', type: 'text' },
    { message: 'What is the lowest price you can offer?', type: 'text' },
    { message: 'Can I schedule a test drive this weekend?', type: 'text' },
    { message: 'Does this include insurance coverage?', type: 'text' },
    { message: 'Is the vehicle still under warranty?', type: 'text' },
    { message: 'Can you deliver to Cebu?', type: 'text' },
    { message: 'What payment methods do you accept?', type: 'text' },
    { message: 'Are there any hidden fees?', type: 'text' },
  ];

  for (let i = 0; i < createdVehicles.length; i++) {
    const vehicle = createdVehicles[i];
    const msgIdx = i % inquiryMessages.length;
    const inquiryUser = i % 2 === 0 ? buyer : sellers[0];

    await prisma.inquiry.create({
      data: {
        vehicleId: vehicle.id,
        userId: inquiryUser.id,
        message: inquiryMessages[msgIdx].message,
        type: inquiryMessages[msgIdx].type,
        status: i < 5 ? 'replied' : 'pending',
      },
    });
  }
  console.log(`Created ${createdVehicles.length} inquiries`);

  // Create sample quotations for installment vehicles
  const insuranceTypes = ['Basic', 'Comprehensive', 'Premium'];

  for (let i = 0; i < installmentVehicles.length; i++) {
    const vehicle = installmentVehicles[i];
    const basePrice = vehicle.price;
    const insuranceType = insuranceTypes[i % insuranceTypes.length];
    const insuranceCost = insuranceType === 'Basic' ? 25000 : insuranceType === 'Comprehensive' ? 45000 : 75000;
    const downPaymentPercent = [20, 25, 30][i % 3];
    const downPayment = (basePrice * downPaymentPercent) / 100;
    const duration = [12, 24, 36, 48, 60][i % 5];
    const accessories = [0, 5000, 15000, 35000][i % 4];
    const deliveryFee = [0, 1500, 5000][i % 3];
    const remainingAmount = basePrice - downPayment + insuranceCost + accessories + deliveryFee;
    const monthlyPayment = remainingAmount / duration;

    await prisma.quotation.create({
      data: {
        vehicleId: vehicle.id,
        basePrice: basePrice,
        insuranceType: insuranceType,
        insuranceCost: insuranceCost,
        downPayment: downPayment,
        duration: duration,
        accessories: accessories,
        deliveryFee: deliveryFee,
        totalPrice: basePrice + insuranceCost + accessories + deliveryFee,
        monthlyPayment: Math.round(monthlyPayment),
      },
    });
    console.log(`Quotation created: ${vehicle.make} ${vehicle.model} - ₱${Math.round(monthlyPayment).toLocaleString()}/mo for ${duration} months`);
  }

  console.log('\n============================================');
  console.log('✅ Database seeded successfully!');
  console.log('============================================');
  console.log('\n📊 Summary:');
  console.log(`   Vehicles: ${createdVehicles.length} total`);
  console.log(`     - For Sale: ${saleVehicles.length} (${saleVehicles.filter(v => v.listingStatus === 'approved').length} approved, ${saleVehicles.filter(v => v.listingStatus === 'pending').length} pending)`);
  console.log(`     - For Rent: ${rentVehicles.length} (${rentVehicles.filter(v => v.listingStatus === 'approved').length} approved, ${rentVehicles.filter(v => v.listingStatus === 'pending').length} pending)`);
  console.log(`     - Installment: ${installmentVehicles.length} (${installmentVehicles.filter(v => v.listingStatus === 'approved').length} approved, ${installmentVehicles.filter(v => v.listingStatus === 'pending').length} pending)`);
  console.log(`   Bookings: ${bookings.length}`);
  console.log(`   Inquiries: ${createdVehicles.length}`);
  console.log(`   Quotations: ${installmentVehicles.length}`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@raypanganiban.tech / password123');
  console.log('   Seller: raypanganiban0825@gmail.com / password123');
  console.log('   Seller: juan@example.com / password123');
  console.log('   Seller: maria@example.com / password123');
  console.log('   Buyer: carlos@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
