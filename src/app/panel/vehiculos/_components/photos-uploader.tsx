"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Props = {
  vehicleId: string;
  autoUploadFiles?: File[];
};

export default function PhotosUploader({ vehicleId, autoUploadFiles }: Props) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autoUploadedRef = useRef(false);
  const dragIndex = useRef<number | null>(null);

  const fetchPhotos = async () => {
    const res = await fetch(`/api/panel/vehicles/${vehicleId}/photos`);
    const data = await res.json();
    setPhotos(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPhotos();
  }, [vehicleId]);

  // Auto-upload queue provided by parent (e.g., after creating vehicle)
  useEffect(() => {
    (async () => {
      if (!autoUploadFiles || autoUploadFiles.length === 0 || autoUploadedRef.current) return;
      autoUploadedRef.current = true;
      setLoading(true);
      const fd = new FormData();
      autoUploadFiles.forEach((f) => fd.append("files", f));
      await fetch(`/api/panel/vehicles/${vehicleId}/photos`, { method: "POST", body: fd });
      await fetchPhotos();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId, autoUploadFiles?.length]);

  const onPick = () => inputRef.current?.click();

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setError(null);
    const fd = new FormData();
    Array.from(e.target.files).forEach((f) => fd.append("files", f));
    const res = await fetch(`/api/panel/vehicles/${vehicleId}/photos`, { method: "POST", body: fd });
    if (!res.ok) {
      setError("Error al subir fotos");
      setLoading(false);
      return;
    }
    await fetchPhotos();
    setLoading(false);
  };

  const saveOrder = async (list: any[]) => {
    await fetch(`/api/panel/vehicles/${vehicleId}/photos/reorder`, {
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
    await move(from, idx);
  };

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setPhotos(reordered.map((p, i) => ({ ...p, position: i })));
    // adjust active index
    setActiveIdx((cur) => {
      if (cur === from) return to;
      if (from < to && cur > from && cur <= to) return cur - 1;
      if (to < from && cur >= to && cur < from) return cur + 1;
      return cur;
    });
    await saveOrder(reordered);
  };

  // (Hacer principal) se logra moviendo hacia arriba hasta la posición 0, igual que en la creación

  const removePhoto = async (photoId: string) => {
    setLoading(true);
    await fetch(`/api/panel/vehicles/${vehicleId}/photos/${photoId}`, { method: "DELETE" });
    await fetchPhotos();
    setLoading(false);
  };

  return (
    <div className="mt-8 card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Fotos</h2>
        <div>
          <button onClick={onPick} className="btn btn-outline"><Upload size={16}/> Agregar fotos</button>
          <input ref={inputRef} hidden type="file" multiple accept="image/*" onChange={onFiles} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm">Procesando...</p>}

      {/* Large preview */}
      {photos.length > 0 ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[activeIdx]?.url}
            alt="Vista previa"
            className="mb-4 aspect-video w-full rounded object-cover"
          />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.map((p, idx) => (
              <li
                key={p.id}
                className={`group relative overflow-hidden rounded border ${activeIdx === idx ? "ring-2 ring-primary" : ""}`}
                draggable
                onDragStart={onDragStart(idx)}
                onDragOver={onDragOver(idx)}
                onDrop={onDrop(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" className="h-28 w-full object-cover" />
                {idx === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium">Principal</span>
                )}
                    <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-black/45 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px]">{`Pos ${idx}`}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded bg-white/90 p-1 text-black hover:bg-white"
                        onClick={(e) => { e.stopPropagation(); removePhoto(p.id); }}
                        title="Borrar"
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
                        disabled={idx === photos.length - 1}
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
        </>
      ) : (
        <p className="text-sm text-gray-600">Aún no hay fotos. Agregá imágenes para comenzar.</p>
      )}
    </div>
  );
}
