import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function doSeed() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.upsert({
    where: { email: "demo@dealer.com" },
    update: { passwordHash },
    create: {
      email: "demo@dealer.com",
      passwordHash,
      name: "Demo User",
  role: "ADMIN",
    },
  });

  const count = await prisma.vehicle.count();


  return { seeded: true } as const;
}

export async function POST() {
  const result = await doSeed();
  return NextResponse.json(result);
}

export async function GET() {
  return POST();
}
