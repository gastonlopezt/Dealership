import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import LeadForm from "../../lead-form";

export default async function ContactoPage({ params }: { params: { id: string } }) {
  const v = await prisma.vehicle.findUnique({
    where: { id: params.id },
    select: {
      id: true, make: true, model: true, year: true, price: true, mileage: true, location: true,
    },
  });

  if (!v) {
    return (
      <main className="mx-auto max-w-2xl p-6">
  <p className="text-muted">Vehículo no encontrado.</p>
  <Link href="/catalogo" className="underline text-primary-600">Volver</Link>
      </main>
    );
  }

  const shortId = v.id.slice(0, 8);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const msg = `Hola, me interesa el ${v.make} ${v.model} ${v.year} (ID ${shortId}). Precio: ${formatCurrency(v.price.toString())} • ${Number(v.mileage).toLocaleString()} km • ${v.location}.`;
  const href = number ? buildWhatsAppLink(number, msg) : undefined;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <nav className="text-sm">
  <Link href={`/catalogo/${v.id}`} className="underline text-primary-600">← Volver al detalle</Link>
      </nav>

      <h1 className="mt-3 text-2xl font-semibold">Contacto por {v.make} {v.model} {v.year}</h1>
  <p className="mt-1 text-sm text-muted">
        Precio: {formatCurrency(v.price.toString())} • {Number(v.mileage).toLocaleString()} km • {v.location}
      </p>

  <section className="mt-6 rounded-xl border p-4 shadow-sm bg-surface border-border">
        <h2 className="mb-3 text-lg font-medium">Dejanos tu consulta</h2>
        <div className="grid gap-3">
          {/* Enviar dentro de la app (admin ve el lead) */}
          <LeadForm vehicleId={v.id} defaultMessage={`Hola, me interesa el ${v.make} ${v.model} ${v.year}. ¿Sigue disponible?`} whatsAppHref={href} />

          {/* <div className="flex gap-2">
            <Link href={`/catalogo/${v.id}`} className="btn btn-outline">Cancelar</Link>
          </div> */}
        </div>
      </section>
    </main>
  );
}
