export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    if (env) return new URL(env).toString().replace(/\/$/, "");
  } catch {}
  return "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (!path.startsWith("/")) path = "/" + path;
  return `${base}${path}`;
}
