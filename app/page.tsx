"use client";
import { useEffect, useState, useRef } from "react";
export default function Page(){
 const [tick,setTick]=useState("----.--");
 const [log,setLog]=useState("Starting...");
 const wsRef=useRef<any>(null);
 useEffect(()=>{
   let tries=0;
   const connect=()=>{
     tries++; setLog(`Connecting try ${tries}...`);
     const ws=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
     wsRef.current=ws;
     ws.onopen=()=>{setLog("Connected ✅"); ws.send(JSON.stringify({ticks:"R_100",subscribe:1}));};
     ws.onmessage=(e)=>{const d=JSON.parse(e.data); if(d.tick){setTick(Number(d.tick.quote).toFixed(2)); setLog(`LIVE ✅ R_100 ${new Date().toLocaleTimeString()}`)}};
     ws.onerror=()=>setLog("Network blocked, retrying...");
     ws.onclose=(e)=>{setLog(`Closed (${e.code}) retry in 2s...`); setTimeout(connect,2000);};
   };
   connect();
   return()=>wsRef.current?.close();
 },[]);
 return(<main style={{background:'black',color:'white',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><h1 style={{fontSize:'50px',fontWeight:'900'}}>OmoshFX</h1><p style={{color:'#4ade80'}}>{log}</p><div style={{fontSize:'70px',fontFamily:'monospace'}}>{tick}</div></main>);
}
