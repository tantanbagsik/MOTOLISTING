import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  const sellerId = searchParams.get('sellerId');
  
  const where: any = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (sellerId) where.vehicle = { sellerId };

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { 
      vehicle: { select: { title: true, make: true, model: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(inquiries);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const inquiry = await prisma.inquiry.create({
    data: {
      vehicleId: body.vehicleId,
      userId: body.userId,
      message: body.message,
      type: body.type || 'text',
      status: 'pending',
    },
  });

  return NextResponse.json(inquiry);
}
