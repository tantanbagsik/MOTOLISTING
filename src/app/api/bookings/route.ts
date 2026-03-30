import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  const userId = searchParams.get('userId');
  
  const where: any = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (userId) where.userId = userId;

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { 
      vehicle: { select: { title: true, make: true, model: true } },
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const booking = await prisma.booking.create({
    data: {
      vehicleId: body.vehicleId,
      userId: body.userId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      pickupTime: body.pickupTime,
      returnTime: body.returnTime,
      duration: body.duration,
      pickupLocation: body.pickupLocation,
      totalPrice: parseFloat(body.totalPrice),
      status: 'confirmed',
      agreementSigned: body.agreementSigned || false,
    },
  });

  if (body.reminderEnabled) {
    const pickupTime = new Date(body.startDate);
    const reminder24h = new Date(pickupTime.getTime() - 24 * 60 * 60 * 1000);
    const reminder1h = new Date(pickupTime.getTime() - 60 * 60 * 1000);

    await prisma.reminder.createMany({
      data: [
        { bookingId: booking.id, type: 'email', scheduledFor: reminder24h },
        { bookingId: booking.id, type: 'email', scheduledFor: reminder1h },
      ],
    });
  }

  return NextResponse.json(booking);
}
