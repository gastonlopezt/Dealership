"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({ photos }: { photos: { id: string; url: string }[] }) {
  const [active, setActive] = useState(0);
  const current = photos[active]?.url ?? null;

  return (
    <div>
      <div className="overflow-hidden rounded-xl" style={{ maxHeight: 520 }}>
        {current ? (
          <Image src={current} alt="Foto principal" width={1200} height={800} className="h-auto w-full object-contain bg-black/5" />
        ) : (
  <div className="flex h-64 items-center justify-center rounded border text-sm text-muted border-border">Sin fotos</div>
        )}
      </div>
      {photos.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {photos.map((p, i) => (
            <li key={p.id}>
  <button type="button" onClick={() => setActive(i)} className={`block overflow-hidden rounded-lg border border-border ${i === active ? "ring-2 ring-primary" : ""}`}>
                <Image src={p.url} alt="" width={200} height={140} className="h-20 w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
