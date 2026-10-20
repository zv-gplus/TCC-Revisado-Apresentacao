declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}

declare namespace Cloudflare {
  interface Env { ADMIN_EMAIL: string; LOG_RATE_SECRET: string; }
}
declare module '*?raw' { const content: string; export default content; }
