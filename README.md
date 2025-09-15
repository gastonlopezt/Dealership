# Dealership

Marketplace simple para publicar y gestionar vehículos (Next.js App Router + Prisma + NextAuth + Tailwind v4 + Cloudinary).

## Características
- Catálogo con búsqueda rápida y filtros avanzados (marca, modelo, año, precio, tipo).
- Detalle de vehículo con galería y JSON-LD para SEO.
- Contacto: envío de consulta in-app y WhatsApp Click-to-Chat (env-based).
- Panel: CRUD de vehículos, gestión de fotos (orden, subida), leads.
- UI con utilidades semánticas (bg-surface, text-muted, border-border) y skeletons.

## Stack
- Next.js 15 (App Router), React 19
- Prisma (MySQL)
- next-auth (JWT)
- Tailwind CSS v4
- Cloudinary (imágenes)

## Estructura
- `src/app` páginas (público y panel) y API routes.
- `src/lib` utilidades (prisma, cloudinary, seo, utils).
- `prisma/` schema y migraciones.

## Requisitos
- Node.js 20+
- Base de datos MySQL (o compatible)

## Variables de entorno
Crea `.env.local` a partir de `.env.example`:
- `DATABASE_URL` (cadena de conexión MySQL)
- `NEXTAUTH_SECRET` (valor aleatorio seguro)
- `NEXTAUTH_URL` (por ejemplo http://localhost:3000)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (ej. 54911XXXXXXX)
- Cloudinary: `CLOUDINARY_URL` o variables individuales de cuenta

## Uso
1) Instalar deps
- npm install

2) Generar Prisma Client y aplicar migraciones (dev)
- npx prisma generate
- npx prisma migrate dev

3) Ejecutar en desarrollo
- npm run dev

4) Build de producción
- npm run build
- npm start

## Scripts
- `dev`, `build`, `start`
- `lint` (puede requerir ajustes de versión de ESLint/Next)
- `typecheck` (TS sin emitir)
- `prisma:generate`

## Despliegue
- Ideal para Vercel. Define las envs en el dashboard.
- Asegura que la DB esté accesible desde el entorno de producción.

## Roadmap
- Tests básicos (utils y API).
- CI: lint/typecheck/build obligatorio en PRs.
- Docs de contribución e imágenes demo.

## Licencia
MIT
