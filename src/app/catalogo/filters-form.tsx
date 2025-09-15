"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export default function FiltersForm({ makes, models }: { makes: string[]; models: string[] }) {
  const sp = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = sp.get("q") ?? "";
  const make = sp.get("make") ?? "";
  const model = sp.get("model") ?? "";
  const type = sp.get("type") ?? "";
  const minYear = sp.get("minYear") ?? "";
  const maxYear = sp.get("maxYear") ?? "";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";
  const sort = sp.get("sort") ?? "created_desc";
  const pageSize = sp.get("pageSize") ?? "12";

  return (
    <form method="get" className="mt-6 card p-4">
      {/* Compact search bar + toggle */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscá por marca o modelo (ej. Toyota, Gol)"
          className="input w-full md:w-[480px]"
          aria-label="Buscar por marca o modelo"
        />
        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">Buscar</button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowFilters((s) => !s)}
            aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>
      </div>

      {/* Hidden fields to preserve current filter params when filters are collapsed */}
      {!showFilters && (
        <div className="hidden">
          {make && <input type="hidden" name="make" value={make} />}
          {model && <input type="hidden" name="model" value={model} />}
          {type && <input type="hidden" name="type" value={type} />}
          {minYear && <input type="hidden" name="minYear" value={minYear} />}
          {maxYear && <input type="hidden" name="maxYear" value={maxYear} />} 
          {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
          {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          {pageSize && <input type="hidden" name="pageSize" value={pageSize} />}
        </div>
      )}

      {/* Expanded advanced filters */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-12">
          <select name="make" defaultValue={make} className="select col-span-2 md:col-span-2" aria-label="Marca">
            <option value="">Todas las marcas</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select name="model" defaultValue={model} className="select col-span-2 md:col-span-2" aria-label="Modelo">
            <option value="">Todos los modelos</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select name="type" defaultValue={type} className="select col-span-2 md:col-span-2" aria-label="Tipo">
            <option value="">Todos los tipos</option>
            <option value="SEDAN">Sedán</option>
            <option value="SUV">SUV</option>
            <option value="PICKUP">Pickup</option>
            <option value="HATCHBACK">Hatchback</option>
          </select>

          <input name="minYear" type="number" placeholder="Año mín" defaultValue={minYear} className="input col-span-1 md:col-span-2" />
          <input name="maxYear" type="number" placeholder="Año máx" defaultValue={maxYear} className="input col-span-1 md:col-span-2" />

          <input name="minPrice" type="number" placeholder="Precio mín" defaultValue={minPrice} className="input col-span-1 md:col-span-2" />
          <input name="maxPrice" type="number" placeholder="Precio máx" defaultValue={maxPrice} className="input col-span-1 md:col-span-2" />

          <select name="sort" defaultValue={sort} className="select col-span-2 md:col-span-2" aria-label="Ordenar por">
            <option value="created_desc">Nuevos primero</option>
            <option value="price_asc">Precio ascendente</option>
            <option value="price_desc">Precio descendente</option>
            <option value="year_desc">Año descendente</option>
            <option value="year_asc">Año ascendente</option>
            <option value="mileage_asc">Menos km</option>
            <option value="mileage_desc">Más km</option>
          </select>

          <select name="pageSize" defaultValue={pageSize} className="select col-span-1 md:col-span-1" aria-label="Resultados por página">
            {[6, 12, 18, 24, 36].map((n) => (
              <option key={n} value={n}>{n} / pág</option>
            ))}
          </select>

          <div className="col-span-2 flex items-center gap-3 md:col-span-3">
            <button type="submit" className="btn btn-primary">Filtrar</button>
          </div>
        </div>
      )}
    </form>
  );
}
