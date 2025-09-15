import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));

  const existing = await prisma.vehicle.findFirst({ where: { id: params.id } });
  if (!existing) return NextResponse.redirect(new URL("/panel/vehiculos", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.redirect(new URL("/panel/vehiculos", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
