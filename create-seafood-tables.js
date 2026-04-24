const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function main() {
  console.log('Pushing schema to database...');
  
  // Create new tables for seafood
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SeafoodCategory" (
      id TEXT PRIMARY KEY DEFAULT cuuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      parent_id TEXT,
      "created_at" TIMESTAMP DEFAULT NOW()
    )
  `);
  
  console.log('Created SeafoodCategory table');
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SeafoodProduct" (
      id TEXT PRIMARY KEY DEFAULT cuuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price FLOAT NOT NULL,
      "compare_price" FLOAT,
      unit TEXT DEFAULT 'kg',
      "category_id" TEXT,
      "vendor_id" TEXT,
      images TEXT[],
      stock INT DEFAULT 0,
      "min_order" INT DEFAULT 1,
      status TEXT DEFAULT 'active',
      featured BOOLEAN DEFAULT false,
      "created_at" TIMESTAMP DEFAULT NOW(),
      "updated_at" TIMESTAMP DEFAULT NOW()
    )
  `);
  
  console.log('Created SeafoodProduct table');
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY DEFAULT cuuid(),
      "order_number" TEXT UNIQUE NOT NULL,
      "user_id" TEXT,
      subtotal FLOAT,
      "shipping_fee" FLOAT DEFAULT 0,
      total FLOAT,
      status TEXT DEFAULT 'pending',
      "payment_method" TEXT,
      "payment_status" TEXT DEFAULT 'pending',
      "shipping_name" TEXT,
      "shipping_phone" TEXT,
      "shipping_address" TEXT,
      "shipping_city" TEXT,
      notes TEXT,
      "created_at" TIMESTAMP DEFAULT NOW(),
      "updated_at" TIMESTAMP DEFAULT NOW()
    )
  `);
  
  console.log('Created Order table');
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      id TEXT PRIMARY KEY DEFAULT cuuid(),
      "order_id" TEXT,
      "product_id" TEXT,
      quantity INT,
      price FLOAT,
      "created_at" TIMESTAMP DEFAULT NOW()
    )
  `);
  
  console.log('Created OrderItem table');
  
  console.log('\n✅ Database tables created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });