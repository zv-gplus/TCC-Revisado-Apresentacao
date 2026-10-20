import { allowRequest, cleanup, writeEvent } from "../../../server/logs";
import { normalizeEvent, readSmallJson } from "../../../server/eventos.mjs";
export const dynamic = "force-dynamic";
function response(status: number) {
  return new Response(null, {
    status,
    headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) },
  });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return response(403);
  try {
    if (!(await allowRequest(request))) return response(429);
    await cleanup();
    const event = normalizeEvent(await readSmallJson(request));
    if (!event) {
      await writeEvent("seguranca", "evento_invalido");
      return response(400);
    }
    await writeEvent(event.type, event.code, "navegador");
    return response(204);
  } catch {
    return response(503);
  }
}
