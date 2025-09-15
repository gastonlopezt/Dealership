"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type LocalFile = { file: File; url: string };

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const [form, setForm] = useState({ make: "", model: "", year: "", price: "", mileage: "", location: "", description: "", type: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onPickImages: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    const mapped = selected.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeAt = (idx: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      // adjust active index
      setActiveIdx((cur) => {
        if (copy.length === 0) return 0;
        if (cur === idx) return Math.max(0, Math.min(idx, copy.length - 1));
        if (cur > idx) return cur - 1;
        return cur;
      });
      return copy;
    });
  };

  const move = (from: number, to: number) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      // adjust active index if needed
      setActiveIdx((cur) => {
        if (cur === from) return to;
        if (from < to && cur > from && cur <= to) return cur - 1;
        if (to < from && cur >= to && cur < from) return cur + 1;
        return cur;
      });
      return arr;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    // Requiere al menos una imagen
    if (files.length === 0) {
      setError("Agregá al menos una imagen del vehículo");
      setSubmitting(false);
      return;
    }

    // 1) Crear vehículo
    const res = await fetch("/api/panel/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        year: Number(form.year),
          type: form.type || null,
        price: Number(form.price),
        mileage: Number(form.mileage),
        location: form.location,
        description: form.description || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Error al crear vehículo");
      setSubmitting(false);
      return;
    }

    const vehicleId = data.id as string;

    // 2) Subir imágenes (si hay)
    if (files.length > 0) {
      const fd = new FormData();
      files.forEach((lf) => fd.append("files", lf.file));
      const up = await fetch(`/api/panel/vehicles/${vehicleId}/photos`, { method: "POST", body: fd });
      if (!up.ok) {
        setError("Vehículo creado, pero falló la subida de imágenes");
        setSubmitting(false);
        // Redirigir al listado para continuar desde allí
        router.push(`/panel/vehiculos`);
        return;
      }
    }

    // 3) Ir al listado de vehículos
    router.push(`/panel/vehiculos`);
  };

  return (
    <main>
      <h1 className="text-2xl font-semibold">Nuevo vehículo</h1>
      {/* Two-column layout: form left, live preview right */}
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {/* Left: form */}
        <form onSubmit={onSubmit} className="grid max-w-xl gap-3">
          <input className="input" name="make" placeholder="Marca" value={form.make} onChange={onChange} required />
          <input className="input" name="model" placeholder="Modelo" value={form.model} onChange={onChange} required />
          <input className="input" name="year" placeholder="Año" type="number" value={form.year} onChange={onChange} required />
            <select className="input" name="type" value={form.type} onChange={onChange} required>
              <option value="">Tipo de vehículo</option>
              <option value="SEDAN">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="PICKUP">Pickup</option>
              <option value="HATCHBACK">Hatchback</option>
            </select>
          <input className="input" name="price" placeholder="Precio" type="number" value={form.price} onChange={onChange} required />
          <input className="input" name="mileage" placeholder="Kilometraje" type="number" value={form.mileage} onChange={onChange} required />
          <input className="input" name="location" placeholder="Ubicación" value={form.location} onChange={onChange} required />
          <textarea className="textarea" name="description" placeholder="Descripción" value={form.description} onChange={onChange} />

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Imágenes</label>
            <div className="mt-2 flex items-center gap-3">
              <input id="file-input" className="sr-only" type="file" accept="image/*" multiple onChange={onPickImages} />
              <label htmlFor="file-input" className="btn btn-outline cursor-pointer"><Upload size={16}/> Elegir imágenes</label>
              <span className="text-sm text-gray-600">{files.length > 0 ? `${files.length} seleccionada(s)` : "Seleccioná al menos una"}</span>
            </div>
          </div>

          <div className="mt-2">
            <button
              disabled={submitting || files.length === 0}
              className="btn btn-primary disabled:opacity-50"
              type="submit"
            >
              {submitting ? "Guardando…" : "Crear vehículo"}
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        {/* Right: live preview */}
        <aside className="card p-4">
          <h2 className="mb-3 text-lg font-semibold">Vista previa</h2>
          {files.length === 0 ? (
            <p className="text-sm text-gray-600">Agregá imágenes para ver la vista previa. La primera será la principal.</p>
          ) : (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={files[activeIdx]?.url}
                alt="Principal"
                className="mb-4 aspect-video w-full rounded object-cover"
              />
              <div className="mb-2 text-sm text-gray-700">Podés reordenar o quitar antes de crear.</div>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {files.map((lf, idx) => (
                  <li
                    key={idx}
                    className={`group relative overflow-hidden rounded border ${activeIdx === idx ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lf.url} alt="preview" className="h-28 w-full object-cover" />
                    {/* top-left badge */}
                    {idx === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium">Principal</span>
                    )}
                    {/* controls overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-black/45 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px]">{`Pos ${idx}`}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded bg-white/90 p-1 text-black hover:bg-white"
                            onClick={(e) => { e.stopPropagation(); removeAt(idx); }}
                            title="Quitar"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === 0}
                            className="rounded bg-white/90 p-1 text-black enabled:hover:bg-white disabled:opacity-40"
                            onClick={(e) => { e.stopPropagation(); move(idx, idx - 1); }}
                            title="Arriba"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === files.length - 1}
                            className="rounded bg-white/90 p-1 text-black enabled:hover:bg-white disabled:opacity-40"
                            onClick={(e) => { e.stopPropagation(); move(idx, idx + 1); }}
                            title="Abajo"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
