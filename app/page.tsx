"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [price,setPrice]=useState("0.00");
const [status,setStatus]=useState("Connecting...");
useEffect(()=>{
const ws=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{
setStatus("Connected - subscribing R_100...");
ws.send(JSON.stringify({ticks_history:"R_100",adjust_start_time:1,count:1,end:"latest",start:1,style:"ticks",subscribe:1}));
};
ws.onmessage=(e)=>{
try{
const d=JSON.parse(e.data);
if(d.tick){setPrice(d.tick.quote.toString());setStatus("LIVE R_100 • "+new Date().toLocaleTimeString());}
if(d.history && d.history.prices){const p=d.history.prices;if(p.length>0)setPrice(p[p.length-1].toString());}
}catch{}
};
ws.onerror=()=>setStatus("Error - retry");
return ()=>ws.close();
},[]);
return(<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:24,fontFamily:"monospace"}}>
<h2>OMOSHFX • R_100 LIVE</h2><p>{status}</p><h1 style={{fontSize:48}}>Price: {price}</h1><p style={{color:"#aaa",marginTop:20}}>omoshfx.site • No token needed • Live</p></div>)
}
