import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function PanelVehiculosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Necesitás iniciar sesión.</p>;
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehículos</h1>
        <Link href="/panel/vehiculos/nuevo" className="btn btn-primary">Nuevo</Link>
      </div>

  <div className="overflow-x-auto rounded-xl border shadow-sm bg-surface border-border">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-surface-muted">
            <tr>
              <th className="px-4 py-3">Vehículo</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Año</th>
              <th className="px-4 py-3">Km</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v: any) => (
              <tr key={v.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{v.make} {v.model}</td>
                <td className="px-4 py-3">{v.type ?? "-"}</td>
                <td className="px-4 py-3">{v.year}</td>
                <td className="px-4 py-3">{Number(v.mileage).toLocaleString()} km</td>
                <td className="px-4 py-3">{formatCurrency(v.price?.toString?.() ?? String(v.price))}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2.5 py-1 text-xs uppercase bg-[color-mix(in_oklab,var(--surface)_70%,var(--border))] text-text">{v.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/panel/vehiculos/${v.id}`} className="btn btn-outline">Editar</Link>
                    <form action={`/panel/vehiculos/${v.id}/delete`} method="post">
                      <button className="btn btn-outline" type="submit">Borrar</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
