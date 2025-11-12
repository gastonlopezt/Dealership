import Image from "next/image";
import Link from "next/link";
import Hero from "../app/assets/img/hero.jpg";
import { ShieldCheck, Wallet, Clock, Star, MessageCircle, Filter, Phone, CarFront, Truck } from "lucide-react";
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
        className="relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-12 bg-surface border-border"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={Hero}
            alt="Auto en exhibición, fondo de concesionaria iluminada"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] sm:object-center"
          />
          {/* Degradado oscuro superior/inferior para asegurar contraste del texto */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0.04) 75%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Encontrá tu próximo auto con confianza
          </h1>
          <p className="mt-2 text-base text-muted sm:text-lg">
            Buscá por marca, modelo o año. Filtrá por precio, tipo y más.
          </p>
          <form action="/catalogo" method="get" className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-6">
            <input className="input h-12 sm:col-span-5 bg-white/90 border-white/60 backdrop-blur supports-backdrop-blur:backdrop-blur" name="q" placeholder="Ej. Corolla, Onix, Hilux…" />
            <div className="flex gap-2 sm:col-span-1">
              {/* <Link href="/catalogo?showFilters=1" className="btn btn-outline w-full sm:w-auto">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-1">Filtros</span>
                            </Link> */}
              <button className="btn btn-primary w-full sm:w-auto" type="submit">Buscar</button>
            </div>
          </form>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border p-3 bg-white/90 border-white/60 shadow-sm backdrop-blur supports-backdrop-blur:backdrop-blur">
              <div className="flex items-center gap-2 font-medium"><Star className="h-4 w-4" /> +500 clientes felices</div>
              <p className="mt-1 text-muted">Experiencia validada por nuestra comunidad.</p>
            </div>
            <div className="rounded-lg border p-3 bg-white/90 border-white/60 shadow-sm backdrop-blur supports-backdrop-blur:backdrop-blur">
              <div className="flex items-center gap-2 font-medium"><Wallet className="h-4 w-4" /> Financiación flexible</div>
              <p className="mt-1 text-muted">Opciones a tu medida, sin letra chica.</p>
            </div>
            <div className="rounded-lg border p-3 bg-white/90 border-white/60 shadow-sm backdrop-blur supports-backdrop-blur:backdrop-blur">
              <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> Revisión mecánica</div>
              <p className="mt-1 text-muted">Estado y documentación verificados.</p>
            </div>
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

      {/* ¿Por qué elegirnos? */}
      <section>
        <h2 className="text-2xl font-semibold">¿Por qué elegirnos?</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { t: "Transparencia", d: "Sin comisión oculta ni letra chica.", Icon: ShieldCheck },
            { t: "Soporte humano", d: "Hablá por WhatsApp cuando quieras.", Icon: MessageCircle },
            { t: "Clientes felices", d: "+500 reseñas positivas.", Icon: Star },
          ].map(({ t, d, Icon }, i) => (
            <div key={i} className="group rounded-2xl border p-5 shadow-sm bg-surface border-border transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-tint text-primary"><Icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
