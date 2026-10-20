import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from "../chatgpt-auth";
import { isOwner } from "../../server/eventos.mjs";
import { allowRequest, listEvents, writeEvent } from "../../server/logs";
export const dynamic = "force-dynamic";
const labels: Record<string, string> = {
  abrir_site: "Site aberto",
  abrir_montador: "Montador aberto",
  comparar: "Comparação solicitada",
  trocar_peca: "Seleção de peça alterada",
  salvar_montagem: "Salvamento solicitado",
  compartilhar: "Link de montagem solicitado",
  erro_javascript: "Erro de JavaScript",
  promessa_rejeitada: "Erro assíncrono",
  falha_recurso: "Falha ao carregar recurso",
  caminho_de_varredura: "Caminho comum de varredura acessado",
  pagina_inexistente: "Página inexistente",
  limite_de_eventos: "Limite de eventos excedido",
  evento_invalido: "Evento fora do formato permitido",
  acesso_negado: "Acesso ao painel recusado",
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const user = await getChatGPTUser();
  if (!isOwner(user, env.ADMIN_EMAIL)) {
    try {
      const h = await headers();
      const request = new Request("https://internal/gestao-ntj-7f42b9c1", { headers: h });
      if (await allowRequest(request)) await writeEvent("seguranca", "acesso_negado");
    } catch {}
    return (
      <main className="monitor">
        <h1>Painel de registros</h1>
        <p>Somente a conta autorizada pode consultar os registros.</p>
        <a href={chatGPTSignInPath("/gestao-ntj-7f42b9c1")} target="_top">
          Entrar com ChatGPT
        </a>
        <p>
          <a href="/">Voltar ao montador</a>
        </p>
      </main>
    );
  }
  const params = await searchParams;
  const type = ["uso", "erro", "seguranca"].includes(params.tipo || "") ? params.tipo! : "";
  let data;
  try {
    data = await listEvents(type);
  } catch {
    return (
      <main className="monitor">
        <h1>Registros indisponíveis</h1>
        <p>Tente atualizar a página em alguns instantes.</p>
      </main>
    );
  }
  return (
    <main className="monitor">
      <header>
        <div>
          <p className="muted">NTJ Builder · Administração</p>
          <h1>Registros do site</h1>
        </div>
        <a href={chatGPTSignOutPath("/")} target="_top">
          Sair
        </a>
      </header>
      <p>
        Até 100 registros recentes. Retenção de até 7 dias e limite de 10 mil registros. Horários de
        Brasília.
      </p>
      <p className="notice">
        Eventos do navegador podem ser bloqueados ou simulados. Um alerta indica algo a conferir;
        não comprova um ataque nem identifica uma pessoa.
      </p>
      <div className="counts">
        {data.counts.map((row: any) => (
          <span key={row.type}>
            {row.type}: <strong>{row.total}</strong>
          </span>
        ))}
      </div>
      <form>
        <label htmlFor="tipo">Filtrar </label>
        <select name="tipo" id="tipo" defaultValue={type}>
          <option value="">Todos</option>
          <option value="uso">Uso</option>
          <option value="erro">Erros</option>
          <option value="seguranca">Segurança</option>
        </select>
        <button>Atualizar</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Tipo</th>
              <th>Evento</th>
              <th>Origem</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: any) => (
              <tr key={row.id}>
                <td>
                  {new Date(row.at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </td>
                <td>{row.type}</td>
                <td>{labels[row.code] || "Outro evento"}</td>
                <td>{row.origin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.rows.length && <p>Nenhum registro neste filtro.</p>}
      <p>
        <a href="/">Voltar ao site</a>
      </p>
    </main>
  );
}
