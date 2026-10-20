import html from '../frontend/index.html?raw';
export async function GET() {
  return new Response(html, {headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-cache',
  }});
}
