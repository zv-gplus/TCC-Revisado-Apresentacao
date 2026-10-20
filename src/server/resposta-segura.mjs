// O servidor nunca permite armazenar páginas dinâmicas compartilhadas em cache.
export function secureResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("CDN-Cache-Control", "no-store");
  headers.set("Cloudflare-CDN-Cache-Control", "no-store");
  headers.set(
    "Vary",
    [
      ...new Set(
        (headers.get("Vary") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .concat("Cookie"),
      ),
    ].join(", "),
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
