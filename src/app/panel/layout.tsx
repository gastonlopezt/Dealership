import Link from "next/link";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Panel</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/panel/vehiculos" className="btn btn-outline">
            Vehículos
          </Link>
          <Link href="/panel/leads" className="btn btn-outline">
            Comentarios
          </Link>
        </nav>
      </div>
      <div className="card p-4">{children}</div>
    </div>
  );
}
