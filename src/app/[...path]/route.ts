import { allowRequest, cleanup, writeEvent } from "../../server/logs";
import { classifyPath } from "../../server/eventos.mjs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    if (await allowRequest(request)) {
      await cleanup();
      const code = classifyPath(new URL(request.url).pathname);
      await writeEvent(code === "caminho_de_varredura" ? "seguranca" : "erro", code);
    }
  } catch {
    /* Uma falha nos logs não altera a resposta da página. */
  }
  return new Response("Página não encontrada. Voltar: /", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
