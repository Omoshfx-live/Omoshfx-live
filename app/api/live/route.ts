export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import WebSocket from 'ws';

export async function GET() {
  try {
    const price = await new Promise<number>((resolve, reject) => {
      const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
      const timeout = setTimeout(() => {
        try { ws.close(); } catch {}
        reject(new Error('timeout'));
      }, 8000);

      ws.on('open', () => {
        ws.send(JSON.stringify({ ticks: 'R_100' }));
      });

      ws.on('message', (data: any) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.tick && msg.tick.quote) {
            clearTimeout(timeout);
            resolve(msg.tick.quote);
            ws.close();
          }
        } catch {}
      });

      ws.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return new Response(JSON.stringify({ price }), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ price: null, error: e.message || 'ws error' }), {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
