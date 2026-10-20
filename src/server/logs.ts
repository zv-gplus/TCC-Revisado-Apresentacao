import { env } from "cloudflare:workers";

const WEEK = 7 * 24 * 60 * 60 * 1000;
function database() {
  if (!env.DB) throw new Error("Registros indisponíveis");
  return env.DB;
}
let lastCleanup = 0;
let cleanupTask: Promise<void> | null = null;
export async function cleanup(force = false) {
  if (cleanupTask) return cleanupTask;
  if (!force && Date.now() - lastCleanup < 60000) return;
  cleanupTask = cleanDatabase();
  try {
    await cleanupTask;
    lastCleanup = Date.now();
  } finally {
    cleanupTask = null;
  }
}
async function cleanDatabase() {
  const db = database();
  const now = Date.now();
  await db.batch([
    db.prepare("DELETE FROM events WHERE at < ?").bind(now - WEEK),
    db.prepare("DELETE FROM limits WHERE expires < ?").bind(now),
    db.prepare(
      "DELETE FROM events WHERE id IN (SELECT id FROM events ORDER BY id DESC LIMIT -1 OFFSET 10000)",
    ),
  ]);
}
export async function writeEvent(type: string, code: string, origin = "servidor") {
  await database()
    .prepare("INSERT INTO events (at, type, code, origin) VALUES (?, ?, ?, ?)")
    .bind(Date.now(), type, code, origin)
    .run();
}
// Filtro rápido por instância. O banco continua impondo o limite entre instâncias.
let activeMinute = -1;
let localTotal = 0;
const localCounts = new Map<string, number>();
export async function allowRequest(request: Request) {
  // O endereço vem da infraestrutura, nunca do JSON do cliente.
  const salt = env.LOG_RATE_SECRET;
  if (!salt) throw new Error("Limitação indisponível");
  const minute = Math.floor(Date.now() / 60000);
  const ip = request.headers.get("cf-connecting-ip") || "indisponivel";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${minute}:${ip}`),
  );
  const key = Array.from(new Uint8Array(digest), (n) => n.toString(16).padStart(2, "0")).join("");
  if (minute !== activeMinute) {
    activeMinute = minute;
    localTotal = 0;
    localCounts.clear();
  }
  localTotal++;
  if (localTotal > 300) return false;
  const count = (localCounts.get(key) || 0) + 1;
  localCounts.set(key, count);
  if (count > 30) {
    if (count === 31) await writeEvent("seguranca", "limite_de_eventos");
    return false;
  }
  const db = database();
  const sql =
    "INSERT INTO limits (key, expires, hits) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET hits = hits + 1 RETURNING hits";
  const rows = await db.batch([
    db.prepare(sql).bind(key, Date.now() + 600000),
    db.prepare(sql).bind("global:" + minute, Date.now() + 600000),
  ]);
  const personal = Number((rows[0].results[0] as { hits?: number })?.hits);
  const global = Number((rows[1].results[0] as { hits?: number })?.hits);
  if (global <= 300 && personal === 31) await writeEvent("seguranca", "limite_de_eventos");
  return personal <= 30 && global <= 300;
}
export async function listEvents(type: string) {
  await cleanup(true);
  const db = database();
  const since = Date.now() - WEEK;
  const query = type
    ? db
        .prepare("SELECT * FROM events WHERE at >= ? AND type = ? ORDER BY id DESC LIMIT 100")
        .bind(since, type)
    : db.prepare("SELECT * FROM events WHERE at >= ? ORDER BY id DESC LIMIT 100").bind(since);
  const [rows, counts] = await Promise.all([
    query.all(),
    db
      .prepare("SELECT type, COUNT(*) AS total FROM events WHERE at >= ? GROUP BY type")
      .bind(since)
      .all(),
  ]);
  return { rows: rows.results, counts: counts.results };
}
