"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  date: string; // ISO string
  text: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Claudia Adari",
    date: "2024-11-20",
    text: "El trámite fue muy sencillo y el trato fue impecable de principio a fin",
    avatar: "https://i.pravatar.cc/80?img=65",
  },
  {
    name: "Ailén Damin",
    date: "2025-02-25",
    text: "Impecable en todo sentido. Atención, entrega y post-venta excelente. Muy organizados y responsables.",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    name: "Fernando Rama",
    date: "2024-09-17",
    text: "Atención de primera, autos impecables y un trato que te hace sentir especial.",
    avatar: "https://i.pravatar.cc/80?img=31",
  },
  {
    name: "Leana Carballo",
    date: "2024-10-12",
    text: "Atención impecable, cumplieron con los tiempos estipulados. ¡Gracias a todo el equipo!",
    avatar: "https://i.pravatar.cc/80?img=49",
  },
  {
    name: "Jony Iglesias",
    date: "2024-11-06",
    text: "Excelente atención y rapidez. Mis próximos autos ya tienen destinatario",
    avatar: "https://i.pravatar.cc/80?img=18",
  },
  {
    name: "Carlos Moreno",
    date: "2024-06-30",
    text: "Muy buena experiencia de compra. Conforme con la búsqueda online y la atención personalizada.",
    avatar: "https://i.pravatar.cc/80?img=3",
  },
];

export default function TestimonialsCarousel() {
  const listRef = useRef<HTMLUListElement | null>(null);

  const scrollByAmount = (dir: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold">Lo que opinan nuestros clientes</h2>
      <div className="relative mt-4">
        <div className="overflow-hidden">
          <ul
            ref={listRef}
            className="flex w-full max-w-full gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth"
            aria-label="Testimonios de clientes"
            aria-roledescription="carousel"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          >
            {testimonials.map((t, i) => (
              <li
                key={i}
                className="snap-start snap-always shrink-0 basis-[85%] sm:basis-[360px] md:basis-[420px] lg:basis-[480px] xl:basis-[520px] rounded-xl border p-4 shadow-sm bg-surface border-border"
              >
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight">{t.name}</div>
                    <div className="text-xs text-muted">
                      {new Date(t.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text">{t.text}</p>
                  </div>
                </div>
              </li>
            ))}
            <li aria-hidden="true" className="shrink-0 basis-4" />
          </ul>
        </div>
        {/* Controles: visibles en md+  */}
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center md:flex">
          <button
            type="button"
            className="pointer-events-auto btn btn-outline h-9 w-9 rounded-full bg-white/80 p-0 backdrop-blur"
            aria-label="Ver testimonios anteriores"
            onClick={() => scrollByAmount(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div> */}
        {/* <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center md:flex">
          <button
            type="button"
            className="pointer-events-auto btn btn-outline h-9 w-9 rounded-full bg-white/80 p-0 backdrop-blur"
            aria-label="Ver más testimonios"
            onClick={() => scrollByAmount(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div> */}
      </div>
    </section>
  );
}
