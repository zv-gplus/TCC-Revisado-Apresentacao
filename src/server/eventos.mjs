// Catálogo fechado: nunca guardamos texto livre enviado pelo visitante.
export const ACTIONS = new Set([
  "abrir_site",
  "abrir_montador",
  "comparar",
  "trocar_peca",
  "salvar_montagem",
  "compartilhar",
]);
export function normalizeEvent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (value.type === "uso" && ACTIONS.has(value.code)) return { type: "uso", code: value.code };
  if (
    value.type === "erro" &&
    ["erro_javascript", "promessa_rejeitada", "falha_recurso"].includes(value.code)
  )
    return { type: "erro", code: value.code };
  return null;
}
export function classifyPath(path) {
  if (/\/(\.env|\.git)(\/|$)|\/(admin|wp-admin|wp-login\.php|phpmyadmin)(\/|$)/i.test(path))
    return "caminho_de_varredura";
  return "pagina_inexistente";
}
export function isOwner(user, allowedEmail) {
  return Boolean(
    typeof user?.userId === "string" &&
      user.userId &&
      typeof user.email === "string" &&
      typeof allowedEmail === "string" &&
      allowedEmail &&
      user.email.toLowerCase() === allowedEmail.toLowerCase(),
  );
}
export async function readSmallJson(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  if (Number(request.headers.get("content-length")) > 512) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const all = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      all.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(all));
  } catch {
    return null;
  }
}
