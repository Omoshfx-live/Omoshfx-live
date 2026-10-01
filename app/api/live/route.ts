export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let lastTick: any = null;
let ws: any = null;

function ensureWS() {
  if (ws) return;
  // @ts-ignore
  import('ws').then(({ default: WS }) => {
    ws = new WS('wss://ws.derivws.com/websockets/v3?app_id=1089');
    ws.on('open', () => ws.send(JSON.stringify({ ticks: 'R_100', subscribe: 1 })));
    ws.on('message', (d: any) => {
      try {
        const j = JSON.parse(d.toString());
        if (j.tick) lastTick = j.tick;
      } catch {}
    });
    ws.on('close', () => { ws = null; setTimeout(ensureWS, 2000); });
    ws.on('error', () => { ws = null; });
  });
}
ensureWS();

export async function GET() {
  ensureWS();
  if (lastTick) {
    return new Response(JSON.stringify({ price: lastTick.quote }), {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    });
  }
  await new Promise(r => setTimeout(r, 800));
  return new Response(JSON.stringify({ price: lastTick?.quote || null }), {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  });
}
