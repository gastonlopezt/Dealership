import Image from "next/image";
import heroImage from "./hero.jpg";
import Link from "next/link";
import { ShieldCheck, Wallet, Star, MessageCircle, Filter, Phone, CarFront, Truck } from "lucide-react";
import TestimonialsCarousel from "../_components/testimonials-carousel";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
    title: "Vista previa de home | Dealership",
};

export default async function HomePreview() {
    const [latest, cheapest] = await Promise.all([
        prisma.vehicle.findMany({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 6,
            include: { photos: { orderBy: { position: "asc" }, take: 1 } },
        }),
        prisma.vehicle.findMany({
            where: { status: "ACTIVE" },
            orderBy: { price: "asc" },
            take: 6,
            include: { photos: { orderBy: { position: "asc" }, take: 1 } },
        }),
    ]);

    // Categorías (solo visual + link simple)
    const categories = [
        { label: "Sedán", href: "/catalogo?type=SEDAN", Icon: CarFront },
        { label: "SUV", href: "/catalogo?type=SUV", Icon: CarFront },
        { label: "Pickup", href: "/catalogo?type=PICKUP", Icon: Truck },
        { label: "Hatchback", href: "/catalogo?type=HATCHBACK", Icon: CarFront },
    ] as const;

    // Marcas destacadas (visual + link simple)
    const brands = [
        "Toyota",
        "Volkswagen",
        "Chevrolet",
        "Ford",
        "Renault",
        "Peugeot",
        "Fiat",
        "Nissan",
    ] as const;

    return (
        <div className="space-y-12 sm:space-y-16">
            {/* Hero con buscador, chips y trust bar */}
            <section
                className="relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-12 bg-surface border-border"
            >
                {/* Fondo con imagen real + capas de degradado para legibilidad */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image
                        src={heroImage}
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
                            <Link href="/catalogo?showFilters=1" className="btn btn-outline w-full sm:w-auto">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-1">Filtros</span>
                            </Link>
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

            {/* Categorías destacadas */}
            <section>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Explorar por categoría</h2>
                    <Link href="/catalogo" className="btn btn-outline">Ver todas →</Link>
                </div>
                {/* Scroll horizontal en mobile, grid en desktop */}
                <div className="mt-4 -mx-4 overflow-x-auto sm:mx-0 sm:overflow-visible">
                    <div className="flex gap-3 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:px-0">
                        {categories.map(({ label, href, Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group min-w-[200px] flex-1 overflow-hidden rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-tint text-primary">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <div className="text-base font-medium">{label}</div>
                                        <div className="mt-0.5 text-xs text-muted">Ver {label}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explorar por marca (chips simples) */}
            <section>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Explorar por marca</h2>
                    <Link href="/catalogo" className="btn btn-outline">Ver todas →</Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {brands.map((b) => (
                        <Link
                            key={b}
                            href={`/catalogo?make=${encodeURIComponent(b)}`}
                            className="btn btn-outline h-9 px-3"
                        >
                            {b}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Últimos publicados */}
            <section>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Últimos publicados</h2>
                    <Link href="/catalogo" className="btn btn-outline">Ver todos →</Link>
                </div>
                <div className="mt-4 rounded-2xl bg-surface-muted p-3 sm:p-5">
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {latest.map((v: any) => {
                            const thumb = v.photos?.[0]?.url ?? null;
                            const isNew = v.createdAt && (Date.now() - new Date(v.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14;
                            const priceNum = Number(v.price);
                            const monthly = isFinite(priceNum) && priceNum > 0 ? Math.round(priceNum / 36) : null;
                            const TypeIcon = v.type === "PICKUP" ? Truck : CarFront;
                            return (
                                <li key={v.id}>
                                    <Link href={`/catalogo/${v.id}`} className="group block overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md bg-surface border-border">
                                        <div className="relative aspect-video w-full overflow-hidden" style={{ background: "color-mix(in oklab, var(--surface) 70%, var(--border))" }}>
                                            {thumb ? (
                                                <Image src={thumb} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                            ) : (
                                                <div className="absolute inset-0 grid place-items-center text-sm text-muted"><span className="rounded bg-white/80 px-2 py-1">Sin foto</span></div>
                                            )}
                                            {isNew && <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white bg-primary">Nuevo</span>}
                                            <span className="absolute right-3 top-3 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Disponible</span>
                                        </div>
                                        <div className="p-3 sm:p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="line-clamp-1 text-base font-semibold sm:text-lg">{v.make} {v.model}</h3>
                                                    <p className="mt-0.5 text-xs text-muted sm:text-sm">Año {v.year}</p>
                                                </div>
                                                <div className="shrink-0 text-right text-sm font-bold sm:text-base">{formatCurrency(v.price?.toString?.() ?? String(v.price))}</div>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex gap-2 items-center">
                                                    <span className="badge">{Number(v.mileage).toLocaleString()} km</span>
                                                    {v.type && <span className="badge inline-flex items-center gap-1"><TypeIcon className="h-3.5 w-3.5" /> {v.type}</span>}
                                                    {v.location && <span className="badge">{v.location}</span>}
                                                </div>
                                                <span className="text-xs text-muted">{new Date(v.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</span>
                                            </div>
                                            {monthly && <div className="mt-2 text-xs text-muted">Cuota estimada desde <span className="font-medium text-text">{formatCurrency(String(monthly))}</span>/mes</div>}
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* Mejores precios */}
            {/* <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Mejores precios</h2>
          <Link href="/catalogo" className="btn btn-outline">Ver todos →</Link>
        </div>
        <div className="mt-4 rounded-2xl bg-surface-muted p-3 sm:p-5">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cheapest.map((v: any) => {
            const thumb = v.photos?.[0]?.url ?? null;
            const priceNum = Number(v.price);
            const monthly = isFinite(priceNum) && priceNum > 0 ? Math.round(priceNum / 36) : null;
            const TypeIcon = v.type === "PICKUP" ? Truck : CarFront;
            return (
              <li key={v.id}>
                <Link href={`/catalogo/${v.id}`} className="group block overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md bg-surface border-border">
                  <div className="relative aspect-video w-full overflow-hidden" style={{ background: "color-mix(in oklab, var(--surface) 70%, var(--border))" }}>
                    {thumb ? <Image src={thumb} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /> : <div className="absolute inset-0 grid place-items-center text-sm text-muted"><span className="rounded bg-white/80 px-2 py-1">Sin foto</span></div>}
                    <span className="absolute right-3 top-3 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Disponible</span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-1 text-base font-semibold sm:text-lg">{v.make} {v.model}</h3>
                      <div className="shrink-0 text-right text-sm font-bold sm:text-base">{formatCurrency(v.price?.toString?.() ?? String(v.price))}</div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="badge">Año {v.year}</span>
                      <span className="badge">{Number(v.mileage).toLocaleString()} km</span>
                      {v.type && <span className="badge inline-flex items-center gap-1"><TypeIcon className="h-3.5 w-3.5" /> {v.type}</span>}
                    </div>
                    {monthly && <div className="mt-2 text-xs text-muted">Cuota estimada desde <span className="font-medium text-text">{formatCurrency(String(monthly))}</span>/mes</div>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
      </section> */}

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

            {/* Testimonios */}
            <TestimonialsCarousel />

            {/* CTA vender auto */}
            <section className="rounded-2xl p-5 text-center sm:p-6 bg-surface-muted">
                <p className="text-base font-medium sm:text-lg">¿Querés vender tu auto?</p>
                <p className="mt-1 text-sm text-muted">Tasamos y publicamos en minutos. Atención por WhatsApp.</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-3">
                    {/* <Link href="/panel" className="btn btn-primary">Publicar ahora</Link> */}
                    <Link href="/catalogo/[id]/contacto" as="/catalogo/placeholder/contacto" className="btn btn-outline hidden sm:inline-flex"><Phone className="mr-1 h-4 w-4" /> Contactanos</Link>
                    {/* <Link href="/catalogo/[id]/contacto" as="/catalogo/placeholder/contacto" className="text-primary-600 text-sm sm:hidden">o hablá por WhatsApp</Link> */}
                </div>
            </section>

            {/* Barra flotante mobile (opcional)
      <div className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-2 gap-2 sm:hidden">
        <Link href="/catalogo" className="btn btn-outline">Explorar</Link>
        <Link href="/panel" className="btn btn-primary">Publicar</Link>
      </div> */}

            {/* Botón flotante de WhatsApp (opcional) desactivado en preview */}
        </div>
    );
}
