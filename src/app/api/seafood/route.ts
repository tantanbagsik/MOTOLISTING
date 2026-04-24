import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { status: "active" };
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (featured === "true") {
      where.featured = true;
    }

    const [products, total] = await Promise.all([
      prisma.seafoodProduct.findMany({
        where,
        include: { category: true, vendor: true },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.seafoodProduct.count({ where }),
    ]);

    return NextResponse.json({ products, total, limit, offset });
  } catch (error) {
    console.error("Error fetching seafood:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, comparePrice, unit, categoryId, vendorId, images, stock, minOrder, featured } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await prisma.seafoodProduct.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        unit,
        categoryId,
        vendorId,
        images: images || [],
        stock: stock || 0,
        minOrder: minOrder || 1,
        featured: featured || false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating seafood:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}