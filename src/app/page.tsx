import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wallet, Clock } from "lucide-react";
import TestimonialsCarousel from "./_components/testimonials-carousel";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const [topMakes, latest] = await Promise.all([
    prisma.vehicle.groupBy({
      by: ["make"],
      where: { status: "ACTIVE" },
      _count: { make: true },
      orderBy: { _count: { make: "desc" } },
      take: 8,
    }),
    prisma.vehicle.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { photos: { orderBy: { position: "asc" }, take: 1 } },
    }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section
        className="rounded-2xl border p-8 shadow-sm md:p-12"
        style={{
          background:
            "radial-gradient(60% 80% at 15% 0%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 70%), " +
            "linear-gradient(180deg, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 55%), var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
            Encontrá tu próximo auto usado
          </h1>
          <p className="mt-2 text-lg text-muted">
            Explorá miles de publicaciones con fotos y filtros avanzados.
          </p>
          <form action="/catalogo" method="get" className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-6">
            <input className="input md:col-span-5" name="q" placeholder="Buscá por marca o modelo (ej. Toyota, Gol)" />
            <button className="btn btn-primary md:col-span-1" type="submit">Buscar</button>
          </form>
  <div className="mt-4 text-sm text-muted">
            ¿Sos concesionaria? Administrá tu inventario desde el{" "}
            <Link
        href="/panel"
  className="underline text-primary-600"
            >
              panel
            </Link>
            .
          </div>
        </div>
      </section>


      {/* Categorías rápidas */}
      <section>
  <h2 className="text-2xl font-semibold">Explorar por categoría</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Sedán", q: "sedan" },
            { label: "SUV", q: "suv" },
            { label: "Pickup", q: "pickup" },
            { label: "Hatchback", q: "hatch" },
          ].map((c) => (
            <Link key={c.q} href={`/catalogo?q=${encodeURIComponent(c.q)}`} className="rounded-xl border p-4 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 bg-surface border-border">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Explorar por marca */}
      <section>
        <h2 className="text-2xl font-semibold">Explorar por marca</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {topMakes.map((m) => (
            <li key={m.make}>
              <Link
                href={`/catalogo?q=${encodeURIComponent(m.make)}`}
                className="inline-flex items-center gap-2 rounded-full border bg-surface border-border px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="font-medium">{m.make}</span>
                <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-xs text-muted">
                  {m._count.make}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Beneficios */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { t: "Autos verificados", d: "Documentación y estado revisados.", Icon: ShieldCheck },
          { t: "Financiación", d: "Opciones flexibles según tu perfil.", Icon: Wallet },
          { t: "Entrega rápida", d: "Coordiná visita y retirá en días.", Icon: Clock },
        ].map(({ t, d, Icon }, i) => (
          <div
            key={i}
            className="group rounded-2xl border p-5 shadow-sm bg-surface border-border transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-tint text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Últimos publicados */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Últimos publicados</h2>
          <Link href="/catalogo" className="btn btn-outline">Ver todos →</Link>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((v: any) => {
            const thumb = v.photos?.[0]?.url ?? null;
            const isNew = v.createdAt && (Date.now() - new Date(v.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14; // 14 días
            return (
              <li key={v.id}>
                <Link href={`/catalogo/${v.id}`} className="group block overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 bg-surface border-[#e5e7eb]">
                  <div
                    className="relative aspect-video w-full overflow-hidden"
                    style={{
                      background: "color-mix(in oklab, var(--surface) 70%, var(--border))",
                    }}
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-sm text-muted">
                        <span className="rounded bg-white/80 px-2 py-1">Sin foto</span>
                      </div>
                    )}
                    {isNew && (
                      <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white bg-primary">Nuevo</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-semibold">
                          {v.make} {v.model}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted">
                          Año {v.year}
                        </p>
                      </div>
                      <div className="shrink-0 text-right text-base font-bold">
                        {formatCurrency(
                          v.price?.toString?.() ?? String(v.price)
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <span className="badge">{Number(v.mileage).toLocaleString()} km</span>
                        {v.location && <span className="badge">{v.location}</span>}
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(v.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

  <TestimonialsCarousel />

      {/* Footer marketing */}
  <section className="rounded-2xl p-6 text-center bg-[color-mix(in_oklab,var(--surface)_85%,var(--border))]">
        <p>¿Querés vender tu auto?</p>
  <p className="mt-1 text-sm text-muted">Contactanos para tasarlo y publicarlo en minutos.</p>
        <Link href="/panel" className="btn btn-primary mt-3 inline-block">Publicar ahora</Link>
      </section>
    </div>
  );
}
