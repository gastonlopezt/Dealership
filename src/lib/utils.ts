export function formatCurrency(amount: number | string, locale = "es-AR", currency = "ARS") {
  try {
    const n = typeof amount === "number" ? amount : Number(amount);
    if (!isFinite(n)) throw new Error("Invalid amount");
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
  } catch {
    try {
      const n = typeof amount === "number" ? amount : Number(amount);
      return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(isFinite(n) ? n : 0);
    } catch {
      return `${amount}`;
    }
  }
}

/** Build a WhatsApp Click-to-Chat URL using an international phone and message. */
export function buildWhatsAppLink(phoneRaw: string, text: string) {
  const phone = (phoneRaw || "").replace(/\D/g, ""); // keep digits only per wa.me requirement
  const msg = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${msg}`;
}
