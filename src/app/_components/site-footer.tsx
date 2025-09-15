import Link from "next/link";
import { Instagram, Facebook, Youtube, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
  <footer className="mt-12 border-t bg-gray-200 border-border">
      <div className="container grid gap-8 py-8 sm:grid-cols-3">
        {/* Brand + Socials */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-white shadow-sm">D</span>
            <span>Dealership</span>
          </Link>
          <p className="mt-2 text-sm text-muted">Autos usados verificados, financiación y entrega rápida.</p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://instagram.com/tuconcesionaria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-black/5 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://facebook.com/tuconcesionaria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-black/5 transition-colors"
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://youtube.com/@tuconcesionaria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-black/5 transition-colors"
            >
              <Youtube className="h-4 w-4" />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold">Enlaces</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/catalogo" className="hover:underline">Catálogo</Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-sm font-semibold">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-muted" />
              <span>Av. Perón 870, Yerba Buena</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted" />
              <a href="tel:+541120000000" className="hover:underline">+54 381 540-8060</a>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="border-t border-border">
        <div className="container flex h-12 items-center justify-between text-xs text-muted">
          <span>© {year} Dealership</span>
          <span>Hecho con Next.js</span>
        </div>
      </div> */}
    </footer>
  );
}
