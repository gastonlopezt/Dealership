"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

type UserShape = { name?: string | null; email?: string | null; role?: string | null } | null;

export default function MobileMenu({ initialUser }: { initialUser: UserShape }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      router.replace("/");
      // En App Router, refresh ayuda a revalidar session
      try { router.refresh(); } catch {}
      setOpen(false);
    }
  };

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="btn btn-outline h-9 w-9 p-0 grid place-items-center"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {open && (
  <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border p-2 shadow-lg bg-surface border-border">
          {/* Opciones (excluye Catálogo que está siempre visible fuera) */}
          {initialUser ? (
            <>
              <Link href="/panel" onClick={() => setOpen(false)} className="mt-1 block rounded px-2 py-1 hover:bg-black/5">Panel</Link>
              <Link href="/panel/vehiculos/nuevo" onClick={() => setOpen(false)} className="mt-1 block rounded px-2 py-1 hover:bg-black/5">Publicar vehículo</Link>
              <div className="my-2 h-px bg-border" />
              <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-black/5">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="mt-1 block rounded px-2 py-1 hover:bg-black/5">Ingresar</Link>
          )}
        </div>
      )}
    </div>
  );
}
