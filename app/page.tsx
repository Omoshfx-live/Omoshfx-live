"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [p,setP]=useState("Loading R_100...");
const [s,setS]=useState("Starting...");
useEffect(()=>{
let ws:any;
const start=()=>{
setS("Connecting to binaryws...");
ws=new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{setS("WS Open - subscribing"); ws.send(JSON.stringify({ticks:"R_100",subscribe:1}))};
ws.onmessage=(m:any)=>{try{let j=JSON.parse(m.data);if(j.tick){setP(Number(j.tick.quote).toFixed(2));setS("LIVE R_100 "+new Date().toLocaleTimeString())}}catch{}};
ws.onerror=()=>{setS("WS Err, retry 2s");setTimeout(start,2000)};
ws.onclose=()=>{setS("WS Closed, retry 2s");setTimeout(start,2000)};
};
start();
return()=>{if(ws)ws.close()};
},[]);
return(<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:22,fontFamily:"monospace"}}><h2>OMOSHFX • R_100 LIVE</h2><p style={{fontSize:11}}>{s}</p><h1 style={{fontSize:48,marginTop:20}}>Price: {p}</h1><p style={{color:"#666",marginTop:20}}>omoshfx.site • Live • No token</p></div>)
}
