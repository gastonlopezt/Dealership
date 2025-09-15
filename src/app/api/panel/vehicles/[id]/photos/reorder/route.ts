import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

// Body: { order: string[] } // array de photoId en el nuevo orden
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.order)) return NextResponse.json({ error: "order requerido" }, { status: 400 });

  // Verificar que el vehículo pertenece al dealer
  const vehicle = await prisma.vehicle.findFirst({ where: { id: params.id } });
  if (!vehicle) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Verificar que todas las fotos pertenecen al vehículo
  const photos = await prisma.vehiclePhoto.findMany({ where: { vehicleId: params.id }, select: { id: true } });
  const validIds = new Set(photos.map((p: { id: string }) => p.id));
  if (!body.order.every((id: string) => validIds.has(id))) {
    return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
  }

  // Actualizar posiciones en batch
  await prisma.$transaction(
    body.order.map((photoId: string, idx: number) =>
      prisma.vehiclePhoto.update({ where: { id: photoId }, data: { position: idx } })
    )
  );

  return NextResponse.json({ ok: true });
}
