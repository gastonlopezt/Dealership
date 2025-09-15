import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import type { Metadata } from "next";
import Gallery from "./_components/gallery";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const v = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { photos: { orderBy: { position: "asc" }, take: 1 } } });
  if (!v) return { title: "Vehículo no encontrado" };
  const title = `${v.make} ${v.model} ${v.year} - ${formatCurrency(v.price.toString())}`;
  const description = v.description ?? `${v.make} ${v.model} ${v.year} en ${v.location}`;
  const images = v.photos?.[0]?.url ? [{ url: v.photos[0].url, width: 1200, height: 800, alt: `${v.make} ${v.model}` }] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const v = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: {
      photos: { orderBy: { position: "asc" } },
  // dealer removed
    },
  });
  if (!v || v.status !== "ACTIVE") {
    return (
      <main className="mx-auto max-w-6xl p-4 md:p-6">
  <p className="text-sm text-muted">Vehículo no encontrado.</p>
  <Link className="underline text-primary-600" href="/catalogo">Volver al catálogo</Link>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${v.make} ${v.model} ${v.year}`,
    description: v.description ?? undefined,
    image: v.photos.map(p => p.url),
    brand: v.make,
    model: v.model,
    offers: { "@type": "Offer", price: Number(v.price), priceCurrency: "ARS", availability: "https://schema.org/InStock" },
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const shortId = v.id.slice(0, 8);
  const waMessage = `Hola, me interesa el ${v.make} ${v.model} ${v.year} (ID ${shortId}).\nPrecio: ${formatCurrency(v.price.toString())} • ${Number(v.mileage).toLocaleString()} km • ${v.location}.\n¿Sigue disponible?`;
  const waHref = waNumber ? buildWhatsAppLink(waNumber, waMessage) : undefined;

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm">
  <Link href="/catalogo" className="underline text-primary-600">Catálogo</Link>
  <span className="mx-2 text-muted">/</span>
  <span className="text-muted">{v.make} {v.model}</span>
      </nav>

      <div className="mt-3 grid gap-6 md:grid-cols-3">
        {/* Gallery with max height and thumbnails */}
        <section className="md:col-span-2">
          <Gallery photos={v.photos as any} />

          {/* Description */}
          {v.description && (
            <section className="mt-6">
              <h2 className="mb-2 text-xl font-semibold">Descripción</h2>
              <p className="whitespace-pre-wrap leading-relaxed">{v.description}</p>
            </section>
          )}
        </section>

        {/* Sticky summary / CTA */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 rounded-xl border p-4 shadow-sm bg-surface border-border">
            <h1 className="text-2xl font-bold">{v.make} {v.model} {v.year}</h1>
            <div className="mt-1 text-sm text-muted">{Number(v.mileage).toLocaleString()} km • {v.location}</div>
            <div className="mt-3 text-3xl font-semibold">{formatCurrency(v.price.toString())}</div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <li className="rounded-lg px-3 py-2 bg-surface-soft">Año <span className="font-medium">{v.year}</span></li>
              <li className="rounded-lg px-3 py-2 bg-surface-soft">Km <span className="font-medium">{Number(v.mileage).toLocaleString()}</span></li>
            </ul>
            <div className="mt-5 space-y-2">
              <Link href={`/catalogo/${v.id}/contacto`} className="btn btn-primary w-full text-center">Contactar</Link>
              <Link href="#" className="btn btn-outline w-full text-center">Simular financiación</Link>
            </div>
            <p className="mt-3 text-xs text-muted">La disponibilidad y precio pueden variar sin previo aviso.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
