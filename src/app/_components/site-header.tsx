import Link from "next/link";
import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserMenu from "./user-menu";
import MobileMenu from "./mobile-menu";

export const dynamic = "force-dynamic";

export default async function SiteHeader() {
  noStore();
  const session = await getServerSession(authOptions);
  const isLogged = !!session?.user;

  return (
  <header className="sticky top-0 z-40 border-b backdrop-blur-sm supports-[backdrop-filter]:bg-white/70 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] border-border">
  <div className="container flex h-14 items-center justify-between gap-2 md:gap-4 overflow-visible">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold min-w-0">
          {/* Simple logomark */}
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-white shadow-sm">D</span>
          <span>Dealership</span>
        </Link>

        {/* Compact search (only when not logged in) */}
        {/* {!isLogged && (
          <form action="/catalogo" method="get" className="hidden items-center gap-2 md:flex">
            <input name="q" placeholder="Marca o modelo" className="input h-9 w-40 text-sm" />
            <button className="btn btn-primary h-9" type="submit">Buscar</button>
          </form>
        )} */}

  <nav className="flex items-center gap-2 text-sm">
          {/* Catálogo como texto en todas las resoluciones */}
          <Link href="/catalogo" className="px-2 py-1 text-primary-600 hover:underline">Catálogo</Link>
          {/* Mobile: hamburguesa (sin cambios) */}
          <MobileMenu initialUser={session?.user ?? null} />
          {/* Desktop: resto de acciones como texto */}
          <div className="hidden items-center gap-4 md:flex">
            {isLogged && (
              <>
                <Link href="/panel" className="px-2 py-1 hover:underline">Panel</Link>
                <Link href="/panel/vehiculos/nuevo" className="px-2 py-1 hover:underline">Publicar vehículo</Link>
              </>
            )}
            <UserMenu initialUser={session?.user ?? null} />
          </div>
        </nav>
      </div>
    </header>
  );
}
