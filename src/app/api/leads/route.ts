import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LeadSchema = z.object({
  vehicleId: z.string().min(1),
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = LeadSchema.parse(json);

    // Verifica que el vehículo exista y esté activo
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      select: { id: true, status: true },
    });
    if (!vehicle || vehicle.status !== "ACTIVE") {
      return new Response(JSON.stringify({ error: "Vehículo no disponible" }), { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        vehicleId: data.vehicleId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
      },
    });

    // En dev: log simple
    console.log("Nuevo lead:", lead);

    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Datos inválidos", issues: e.issues }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
