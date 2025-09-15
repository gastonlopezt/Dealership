"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function LeadForm({ vehicleId, defaultMessage, whatsAppHref }: { vehicleId: string; defaultMessage?: string; whatsAppHref?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: defaultMessage ?? "" });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(false);
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, ...form }),
    });
    setSubmitting(false);
    if (!res.ok) { setError("Error al enviar"); return; }
    setOk(true);
    setForm({ name: "", email: "", phone: "", message: defaultMessage ?? "" });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {ok && (
        <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
          <div>
            <p className="font-medium">Consulta enviada</p>
            <p>Te contactaremos a la brevedad.</p>
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <input className="input" name="name" placeholder="Nombre" value={form.name} onChange={onChange} required />
      <input className="input" name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} />
      <input className="input" name="phone" placeholder="Teléfono" value={form.phone} onChange={onChange} />
      <textarea className="textarea" name="message" placeholder="Mensaje" value={form.message} onChange={onChange} rows={4} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <button className="btn btn-primary" type="submit" disabled={submitting || ok}>
          {submitting ? "Enviando..." : ok ? "Enviado" : "Enviar"}
        </button>
        {whatsAppHref && (
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-center btn-outline"
            aria-label="Contactar por WhatsApp"
            title="Contactar por WhatsApp"
          >
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
