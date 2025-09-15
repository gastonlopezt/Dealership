"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserShape = { name?: string | null; email?: string | null; role?: string | null } | null;

export default function UserMenu({ initialUser }: { initialUser: UserShape }) {
  const [user, setUser] = useState<UserShape>(initialUser);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Optional refresh to ensure client state stays in sync after hydration
    (async () => {
      try {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.user ?? null);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
  <Link href="/login" className="px-2 py-1 hover:underline text-primary-600">Ingresar</Link>
      </div>
    );
  }

  const onSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      router.replace("/");
      try { router.refresh(); } catch {}
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="px-2 py-1 hover:underline">
        {user.name || user.email || "Cuenta"}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border p-2 shadow-lg bg-surface border-border">
          <div className="px-2 py-1 text-xs text-muted">{user.email}</div>
          <div className="my-1 h-px bg-border" />
          <Link href="/panel" className="block rounded px-2 py-1 hover:bg-black/5">Ir al panel</Link>
          <Link href="/panel/vehiculos/nuevo" className="mt-1 block rounded px-2 py-1 hover:bg-black/5">Publicar vehículo</Link>
          <button onClick={onSignOut} className="mt-1 block w-full rounded px-2 py-1 text-left hover:bg-black/5">Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
