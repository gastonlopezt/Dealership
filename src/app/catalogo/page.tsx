import FiltersForm from "./filters-form";
import VehiclesList from "./vehicles-list";
import { prisma } from "@/lib/prisma";

export default async function CatalogoPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const q = (searchParams?.q as string) || undefined;
  const make = (searchParams?.make as string) || undefined;
  const model = (searchParams?.model as string) || undefined;
  const type = (searchParams?.type as string) || undefined;
  const minYear = searchParams?.minYear ? Number(searchParams.minYear) : undefined;
  const maxYear = searchParams?.maxYear ? Number(searchParams.maxYear) : undefined;
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;

  const sort = (searchParams?.sort as string) || "created_desc";
  const page = searchParams?.page ? Math.max(1, Number(searchParams.page)) : 1;
  const pageSize = searchParams?.pageSize ? Math.min(60, Math.max(6, Number(searchParams.pageSize))) : 12;

  const [makes, models] = await Promise.all([
    prisma.vehicle
      .findMany({ select: { make: true }, distinct: ["make"], orderBy: { make: "asc" } })
      .then((r: { make: string }[]) => r.map((x: { make: string }) => x.make)),
    prisma.vehicle
      .findMany({ where: make ? { make } : undefined, select: { model: true }, distinct: ["model"], orderBy: { model: "asc" } })
      .then((r: { model: string }[]) => r.map((x: { model: string }) => x.model)),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Catálogo</h1>
      <p className="mt-2 text-muted">Explora autos disponibles.</p>
      <FiltersForm makes={makes} models={models} />
      <VehiclesList
        filters={{ q, make, model, type, minYear, maxYear, minPrice, maxPrice }}
        sort={sort}
        page={page}
        pageSize={pageSize}
        withPhotos
      />
    </div>
  );
}
