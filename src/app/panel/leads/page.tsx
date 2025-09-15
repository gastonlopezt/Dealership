import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>No autenticado</div>;
  }
  const leads = await prisma.lead.findMany({
  where: {},
    include: { vehicle: { select: { id: true, make: true, model: true, year: true, price: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Consultas</h1>
      {leads.length === 0 ? (
  <p className="text-sm text-muted">Sin consultas por ahora.</p>
      ) : (
  <div className="overflow-x-auto rounded-xl border shadow-sm bg-surface border-border">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-surface-muted">
              <tr>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Vehículo</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Teléfono</th>
                <th className="px-3 py-2">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l: any) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-3 py-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <Link href={`/catalogo/${l.vehicle.id}`} className="underline text-primary-600">
                      {l.vehicle.make} {l.vehicle.model} {l.vehicle.year}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{l.name}</td>
                  <td className="px-3 py-2">{l.email || "-"}</td>
                  <td className="px-3 py-2">{l.phone || "-"}</td>
                  <td className="px-3 py-2 max-w-[360px]">{l.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
