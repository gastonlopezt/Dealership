"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const doSignIn = async (userEmail: string, userPassword: string) => {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email: userEmail, password: userPassword, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.replace("/");
      try { router.refresh(); } catch {}
    } else {
      setError("Credenciales inválidas");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSignIn(email, password);
  };



  return (
    <main className="grid min-h-[calc(100vh-56px)] place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Accedé al panel
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm" style={{ color: "var(--muted)" }}>Email</span>
              <div className="relative">
                {/* <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--muted)" }} /> */}
                <input
                  className="input pl-9"
                  placeholder="tu@correo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-sm" style={{ color: "var(--muted)" }}>Password</span>
              <div className="relative">
                {/* <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--muted)" }} /> */}
                <input
                  className="input pr-9 pl-9"
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/5"
                  aria-label={showPw ? "Ocultar password" : "Mostrar password"}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button type="submit" className="btn btn-primary flex items-center justify-center gap-2" disabled={loading}>
              <LogIn className="h-4 w-4" /> {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 grid gap-2">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              ¿No tenés cuenta? Escribinos para crear tu acceso.
            </p>
          </div>
          {/* <div className="mt-6 text-center text-sm">
            <Link href="/catalogo" className="underline" style={{ color: "var(--primary-600)" }}>Volver al catálogo</Link>
          </div> */}
        </div>
      </div>
    </main>
  );
}
