export const dynamic = 'force-dynamic';
export async function GET(){
 try{
  const price = await new Promise((resolve, reject)=>{
    const {WebSocket} = require('ws');
    const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    const to = setTimeout(()=>{try{ws.close()}catch{}; reject("timeout")}, 6000);
    ws.on('open',()=>ws.send(JSON.stringify({ticks:"R_100"})));
    ws.on('message',(data:any)=>{
      try{
        const d=JSON.parse(data.toString());
        if(d.tick){clearTimeout(to); resolve(d.tick.quote); ws.close();}
      }catch{}
    });
    ws.on('error',(e:any)=>{clearTimeout(to); reject(e.message)});
  });
  return new Response(JSON.stringify({price}),{headers:{"Cache-Control":"no-store"}});
 }catch(e:any){
  return new Response(JSON.stringify({price:null, error:String(e)}),{status:500, headers:{"Cache-Control":"no-store"}});
 }
}
