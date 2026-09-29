"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [price,setPrice]=useState(0);
const [status,setStatus]=useState("Connecting to R_100...");
useEffect(()=>{
const ws=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{
setStatus("LIVE • No token needed for price");
ws.send(JSON.stringify({ticks:"R_100",subscribe:1}));
};
ws.onmessage=(e)=>{
const d=JSON.parse(e.data);
if(d.tick){setPrice(d.tick.quote); setStatus("LIVE • R_100")}
};
ws.onerror=()=>setStatus("Reconnecting...");
ws.onclose=()=>setStatus("Reconnecting...");
return ()=>ws.close();
},[]);
return (<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:20,fontFamily:"monospace"}}>
<h1>OMOSHFX • R_100 LIVE</h1><p>Status: {status}</p><h2 style={{fontSize:32}}>Price: {price}</h2><p style={{color:"#aaa"}}>omoshfx.site • Live • No token needed</p></div>)}
