import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { make, model, year, price, mileage, location, description, type } = body as Record<string, any>;

  if (!make || !model || !year || !price || !mileage || !location) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const allowedTypes = ["SEDAN", "SUV", "PICKUP", "HATCHBACK"] as const;
  const sanitizedType = typeof type === "string" && type.trim()
    ? (type.trim().toUpperCase() as string)
    : "";

  const data: any = {
    make: String(make).trim(),
    model: String(model).trim(),
    year: Number(year),
    price: Number(price),
    mileage: Number(mileage),
    location: String(location).trim(),
    description: description ? String(description).trim() : null,
    status: "ACTIVE" as const,
  };
  if (sanitizedType && (allowedTypes as readonly string[]).includes(sanitizedType)) {
    data.type = sanitizedType;
  }

  if (!Number.isFinite(data.year) || !Number.isFinite(data.price) || !Number.isFinite(data.mileage)) {
    return NextResponse.json({ error: "Datos numéricos inválidos" }, { status: 400 });
  }

  try {
    const created = await prisma.vehicle.create({ data });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "DB error" }, { status: 500 });
  }
}
