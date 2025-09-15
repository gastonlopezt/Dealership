import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { destroyPublicId } from "@/lib/cloudinary";
import type { Prisma } from "@prisma/client";

export async function DELETE(_req: Request, { params }: { params: { id: string; photoId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure the photo belongs to a vehicle of this dealer
  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: params.photoId } });
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vehicle = await prisma.vehicle.findFirst({ where: { id: photo.vehicleId } });
  if (!vehicle) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Delete DB record in a transaction, then destroy asset in Cloudinary afterwards
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.vehiclePhoto.delete({ where: { id: photo.id } });
  });
  if (photo.publicId) await destroyPublicId(photo.publicId);

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string; photoId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.position !== "number") return NextResponse.json({ error: "position requerido" }, { status: 400 });

  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: params.photoId } });
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vehicle = await prisma.vehicle.findFirst({ where: { id: photo.vehicleId } });
  if (!vehicle) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.vehiclePhoto.update({ where: { id: photo.id }, data: { position: body.position } });
  return NextResponse.json({ ok: true });
}
