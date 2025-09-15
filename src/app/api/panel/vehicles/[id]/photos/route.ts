import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { uploadBuffer } from "@/lib/cloudinary";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const photos = await prisma.vehiclePhoto.findMany({ where: { vehicleId: params.id }, orderBy: { position: "asc" } });
  return NextResponse.json(photos);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll("files");
  if (!files || files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

  const v = await prisma.vehicle.findFirst({ where: { id: params.id } });
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existingCount = await prisma.vehiclePhoto.count({ where: { vehicleId: v.id } });

  const uploaded: any[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!(file instanceof File)) continue;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const up = await uploadBuffer(buffer, `dealership/${v.id}`);
    const photo = await prisma.vehiclePhoto.create({
      data: {
        vehicleId: v.id,
        publicId: up.public_id,
        url: up.secure_url,
        width: up.width,
        height: up.height,
        position: existingCount + i,
      },
    });
    uploaded.push(photo);
  }

  return NextResponse.json({ ok: true, count: uploaded.length, photos: uploaded });
}
