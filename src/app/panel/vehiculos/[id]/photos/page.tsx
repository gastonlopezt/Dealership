"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PhotosPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);

  const fetchPhotos = async () => {
    const res = await fetch(`/api/panel/vehicles/${id}/photos`);
    const data = await res.json();
    setPhotos(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPhotos();
  }, [id]);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setError(null);
    const fd = new FormData();
    Array.from(e.target.files).forEach((f) => fd.append("files", f));
    const res = await fetch(`/api/panel/vehicles/${id}/photos`, { method: "POST", body: fd });
    if (!res.ok) {
      setError("Error al subir fotos");
      setLoading(false);
      return;
    }
    await fetchPhotos();
    setLoading(false);
  };

  const saveOrder = async (list: any[]) => {
    await fetch(`/api/panel/vehicles/${id}/photos/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: list.map((p) => p.id) }),
    });
  };

  const onDragStart = (idx: number) => (e: React.DragEvent) => {
    dragIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (idx: number) => async (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === idx) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(idx, 0, moved);
    setPhotos(reordered.map((p, i) => ({ ...p, position: i })));
    await saveOrder(reordered);
  };

  const markAsPrimary = async (photoId: string) => {
    const idx = photos.findIndex((p) => p.id === photoId);
    if (idx <= 0) return; // ya es principal o no encontrada
    const reordered = [...photos];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(0, 0, moved);
    setPhotos(reordered.map((p, i) => ({ ...p, position: i })));
    await saveOrder(reordered);
  };

  const removePhoto = async (photoId: string) => {
    setLoading(true);
    await fetch(`/api/panel/vehicles/${id}/photos/${photoId}`, { method: "DELETE" });
    await fetchPhotos();
    setLoading(false);
  };

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">Fotos</h1>
      <input type="file" multiple accept="image/*" onChange={onChange} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm">Procesando...</p>}
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((p, idx) => (
          <li
            key={p.id}
            className="rounded border p-2"
            draggable
            onDragStart={onDragStart(idx)}
            onDragOver={onDragOver(idx)}
            onDrop={onDrop(idx)}
          >
            <Image src={p.url} alt="" width={300} height={200} className="h-auto w-full object-cover" />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>{idx === 0 ? "Principal" : `Pos: ${p.position}`}</span>
              <div className="flex gap-2">
                <button className="rounded border px-2 py-1" onClick={() => removePhoto(p.id)}>Borrar</button>
                {idx > 0 && (
                  <button className="rounded border px-2 py-1" onClick={() => markAsPrimary(p.id)}>
                    Hacer principal
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
