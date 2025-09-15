"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import PhotosUploader from "../_components/photos-uploader";
import { useRouter } from "next/navigation";

export default function EditVehiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [form, setForm] = useState({ make: "", model: "", year: "", price: "", mileage: "", location: "", description: "", status: "ACTIVE", type: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/panel/vehicles/${id}`);
      if (!res.ok) {
        setError("No se pudo cargar el vehículo");
        setLoading(false);
        return;
      }
      const v = await res.json();
      setForm({
        make: v.make,
        model: v.model,
        year: String(v.year),
        price: String(v.price),
        mileage: String(v.mileage),
        location: v.location,
        description: v.description ?? "",
        status: v.status,
        type: v.type ?? "",
      });
      setLoading(false);
    })();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    const res = await fetch(`/api/panel/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
        location: form.location,
        description: form.description || null,
        status: form.status,
        type: form.type || null,
      }),
    });
  if (!res.ok) { setError("Error al guardar"); return; }
  // Redirigir al listado de vehículos tras guardar correctamente
  router.push("/panel/vehiculos");
  };

  if (loading)
    return (
      <main>
        <div className="animate-pulse">
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="grid max-w-xl gap-3">
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
              <div className="h-10 w-32 rounded bg-gray-200" />
            </div>
            <aside>
              <div className="card p-4">
                <div className="mb-3 h-6 w-28 rounded bg-gray-200" />
                <div className="mb-4 aspect-video w-full rounded bg-gray-200" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <div className="h-28 rounded bg-gray-200" />
                  <div className="h-28 rounded bg-gray-200" />
                  <div className="h-28 rounded bg-gray-200" />
                  <div className="h-28 rounded bg-gray-200" />
                  <div className="h-28 rounded bg-gray-200" />
                  <div className="h-28 rounded bg-gray-200" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <h1 className="text-2xl font-semibold">Editar vehículo</h1>
      {/* Two-column layout: form left, photos right (same as creation) */}
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="grid max-w-xl gap-3">
          <input className="input" name="make" placeholder="Marca" value={form.make} onChange={onChange} required />
          <input className="input" name="model" placeholder="Modelo" value={form.model} onChange={onChange} required />
          <input className="input" name="year" placeholder="Año" type="number" value={form.year} onChange={onChange} required />
          <input className="input" name="price" placeholder="Precio" type="number" value={form.price} onChange={onChange} required />
          <input className="input" name="mileage" placeholder="Kilometraje" type="number" value={form.mileage} onChange={onChange} required />
          <input className="input" name="location" placeholder="Ubicación" value={form.location} onChange={onChange} required />
          <textarea className="textarea" name="description" placeholder="Descripción" value={form.description} onChange={onChange} />
          <select className="select" name="status" value={form.status} onChange={onChange}>
            <option value="ACTIVE">Activo</option>
            <option value="PAUSED">Pausado</option>
            <option value="DRAFT">Borrador</option>
            <option value="SOLD">Vendido</option>
          </select>
          <select className="select" name="type" value={form.type} onChange={onChange}>
            <option value="">Sin tipo</option>
            <option value="SEDAN">Sedán</option>
            <option value="SUV">SUV</option>
            <option value="PICKUP">Pickup</option>
            <option value="HATCHBACK">Hatchback</option>
          </select>
          <button className="btn btn-primary" type="submit">Guardar</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {ok && <p className="text-sm text-green-600">{ok}</p>}
        </form>

        {/* Right: photos with the same card/preview pattern */}
        <aside>
          <PhotosUploader vehicleId={id} />
        </aside>
      </div>
    </main>
  );
}
