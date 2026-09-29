"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [price,setPrice]=useState("Loading...");
const [status,setStatus]=useState("Connecting...");
const [dot,setDot]=useState(0);
useEffect(()=>{
let ws:any; let tries=0;
function connect(){
tries++;
setStatus(`Connecting try ${tries} to Deriv...`);
try{
ws=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{
setStatus("Connected! Waiting tick...");
ws.send(JSON.stringify({ticks:"R_100",subscribe:1}));
};
ws.onmessage=(e:any)=>{
try{
const d=JSON.parse(e.data);
if(d.tick){
setPrice(d.tick.quote.toFixed(2));
setStatus(`LIVE R_100 • ${new Date().toLocaleTimeString()} • ${d.tick.quote}`);
}
if(d.error){setStatus("API Error: "+d.error.message); }
}catch{}
};
ws.onerror=()=>{
setStatus(`WS Error try ${tries} - retry 2s...`);
setTimeout(connect,2000);
};
ws.onclose=()=>{
setStatus(`Closed - reconnect ${tries+1} in 2s...`);
setTimeout(connect,2000);
};
}catch(err:any){setStatus("JS Error: "+err.message); setTimeout(connect,2000);}
}
connect();
const i=setInterval(()=>setDot(d=>d+1),500);
return ()=>{clearInterval(i); if(ws)ws.close();}
},[]);
return(<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:24,fontFamily:"monospace"}}>
<h2>OMOSHFX • R_100 LIVE{".repeat(dot%4)}</h2>
<p style={{fontSize:12,color:"#0f8"}}>{status}</p>
<h1 style={{fontSize:52,marginTop:20}}>Price: {price}</h1>
<div style={{marginTop:30,border:"1px solid #0F0",padding:10}}>
<p>✓ No token needed</p>
<p>✓ Live from Deriv R_100</p>
<p>✓ omoshfx.site</p>
</div>
<p style={{color:"#aaa",marginTop:20,fontSize:11}}>If 0.00 > 10s, refresh. Deriv sometimes slow in KE</p>
</div>)
}
