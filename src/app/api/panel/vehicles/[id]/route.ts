import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: params.id },
    include: { photos: { orderBy: { position: "asc" } } },
  });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const existing = await prisma.vehicle.findFirst({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { make, model, year, price, mileage, location, description, status, type } = body as Record<string, any>;

  const data: any = {};
  if (make !== undefined) data.make = String(make).trim();
  if (model !== undefined) data.model = String(model).trim();
  if (year !== undefined) data.year = Number(year);
  if (price !== undefined) data.price = Number(price);
  if (mileage !== undefined) data.mileage = Number(mileage);
  if (location !== undefined) data.location = String(location).trim();
  if (description !== undefined) data.description = description ? String(description).trim() : null;
  if (status !== undefined) data.status = String(status);
  if (type !== undefined) {
    const t = String(type).trim().toUpperCase();
    const allowed = ["SEDAN", "SUV", "PICKUP", "HATCHBACK"] as const;
    data.type = t && (allowed as readonly string[]).includes(t) ? t : null;
  }

  try {
  const updated = await prisma.vehicle.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "DB error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.vehicle.findFirst({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
