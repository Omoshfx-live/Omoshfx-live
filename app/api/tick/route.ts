export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
export async function GET() {
 return new Promise((resolve) => {
  const WebSocket = require("ws");
  const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
  let done = false;
  const t = setTimeout(() => {
   if(!done){done=true; ws.terminate(); resolve(NextResponse.json({error:"Timeout"}, {status:500}))}
  }, 8000);
  ws.on("open", () => ws.send(JSON.stringify({ticks:"R_100"})));
  ws.on("message", (d:any) => {
   try{
    const m = JSON.parse(d.toString());
    if(m.tick && !done){done=true; clearTimeout(t); ws.close(); resolve(NextResponse.json({price:m.tick.quote}))}
   }catch{}
  });
  ws.on("error", (e:any) => {
   if(!done){done=true; clearTimeout(t); resolve(NextResponse.json({error:e.message}, {status:500}))}
  });
 });
}
