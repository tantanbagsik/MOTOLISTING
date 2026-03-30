import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function getAuthSession() {
  const session = await getServerSession();
  return session;
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function checkListingOwnership(vehicleId: string, userId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });
  return vehicle?.sellerId === userId;
}
