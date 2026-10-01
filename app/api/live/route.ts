export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const price: any = await new Promise((resolve, reject) => {
      // @ts-ignore
      const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
      const timeout = setTimeout(() => {
        try { (ws as any).close(); } catch {}
        reject('timeout');
      }, 7000);

      (ws as any).onopen = () => {
        ws.send(JSON.stringify({ ticks: 'R_100' }));
      };
      (ws as any).onmessage = (msg: any) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.tick) {
            clearTimeout(timeout);
            resolve(data.tick.quote);
            try { (ws as any).close(); } catch {}
          }
        } catch {}
      };
      (ws as any).onerror = () => {
        clearTimeout(timeout);
        reject('ws error');
      };
    });

    return new Response(JSON.stringify({ price }), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ price: null, error: String(e) }), {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
