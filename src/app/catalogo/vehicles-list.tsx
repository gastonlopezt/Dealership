import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export type CatalogFilters = {
  q?: string;
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
};

const ALLOWED_TYPES = ["SEDAN", "SUV", "PICKUP", "HATCHBACK"] as const;

function buildWhere(filters?: CatalogFilters): any {
  const where: any = { status: "ACTIVE" };
  if (!filters) return where;

  const { q, make, model, minYear, maxYear, minPrice, maxPrice, type } = filters;
  if (q && q.trim()) {
    where.OR = [
      { make: { contains: q } },
      { model: { contains: q } },
    ];
  }
  if (make) where.make = { contains: make };
  if (model) where.model = { contains: model };
  if (type && ALLOWED_TYPES.includes(type as any)) {
    where.type = type;
  }
  if (minYear || maxYear) {
    where.year = {
      ...(minYear ? { gte: minYear } : {}),
      ...(maxYear ? { lte: maxYear } : {}),
    };
  }
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: minPrice } : {}),
      ...(maxPrice ? { lte: maxPrice } : {}),
    };
  }
  return where;
}

function mapSort(sort?: string): any {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "year_desc":
      return { year: "desc" };
    case "year_asc":
      return { year: "asc" };
    case "mileage_asc":
      return { mileage: "asc" };
    case "mileage_desc":
      return { mileage: "desc" };
    case "created_desc":
    default:
      return { createdAt: "desc" };
  }
}

export default async function VehiclesList({ filters, page = 1, pageSize = 12, sort = "created_desc", withPhotos = false }: { filters?: CatalogFilters; page?: number; pageSize?: number; sort?: string; withPhotos?: boolean }) {
  const where = buildWhere(filters);
  const [total, vehicles] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      orderBy: mapSort(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
      ...(withPhotos ? { include: { photos: { take: 1, orderBy: { position: "asc" } } } } : {}),
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (vehicles.length === 0) {
    return <p className="mt-6 text-sm text-muted">No hay resultados para los filtros seleccionados.</p>;
  }

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v: any) => {
          const thumb = withPhotos ? v.photos?.[0]?.url ?? null : null;
          const isNew = v.createdAt && (Date.now() - new Date(v.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14; // 14 días
          return (
            <li key={v.id}>
              <Link href={`/catalogo/${v.id}`} className="group block overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 bg-surface border-[#e5e7eb]">
                <div className="relative aspect-video w-full overflow-hidden bg-surface-soft">
                  {thumb ? (
                    <Image src={thumb} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm text-muted"><span className="rounded bg-white/80 px-2 py-1">Sin foto</span></div>
                  )}
                  {isNew && (
                    <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white bg-primary">Nuevo</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-1 text-lg font-semibold">{v.make} {v.model}</h3>
                      <p className="mt-0.5 text-sm text-muted">Año {v.year}</p>
                    </div>
                    <div className="shrink-0 text-right text-base font-bold">{formatCurrency(v.price?.toString?.() ?? String(v.price))}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge">{Number(v.mileage).toLocaleString()} km</span>
                    {v.location && <span className="badge">{v.location}</span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted">#{v.id.slice(0, 8)}</span>
                    <span className="text-sm font-medium text-primary">Ver detalles →</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-4">
        <a className={`rounded border px-3 py-1 ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`} href={`?${buildQuery(filters, { page: String(prevPage), pageSize: String(pageSize), sort })}`}>Anterior</a>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <a className={`rounded border px-3 py-1 ${page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`} href={`?${buildQuery(filters, { page: String(nextPage), pageSize: String(pageSize), sort })}`}>Siguiente</a>
      </div>
    </>
  );
}

function buildQuery(filters: CatalogFilters | undefined, updates: Record<string, string>) {
  const sp = new URLSearchParams();
  if (filters?.q) sp.set("q", filters.q);
  if (filters?.make) sp.set("make", filters.make);
  if (filters?.model) sp.set("model", filters.model);
  if (filters?.minYear) sp.set("minYear", String(filters.minYear));
  if (filters?.maxYear) sp.set("maxYear", String(filters.maxYear));
  if (filters?.minPrice) sp.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) sp.set("maxPrice", String(filters.maxPrice));
  if (filters?.type) sp.set("type", String(filters.type));
  Object.entries(updates).forEach(([k, v]) => sp.set(k, v));
  return sp.toString();
}
