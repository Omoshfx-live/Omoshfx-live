"use client";
import { useEffect, useState, useRef } from "react";
export default function Page(){
const [tick,setTick]=useState("----.--");
const [stat,setStat]=useState("Connecting...");
const ws=useRef<any>(null);
useEffect(()=>{
const c=()=>{
ws.current=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
ws.current.onopen=()=>{setStat("LIVE ✅ R_100"); ws.current.send(JSON.stringify({ticks:"R_100"}));};
ws.current.onmessage=(e:any)=>{const d=JSON.parse(e.data); if(d.tick) setTick(d.tick.quote);};
ws.current.onclose=()=>setTimeout(c,2000);
};c();return()=>ws.current?.close();
},[]);
return(<main style={{background:'black',color:'white',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><h1 style={{fontSize:'50px',fontWeight:'900'}}>OmoshFX</h1><p style={{color:'#4ade80'}}>{stat}</p><div style={{fontSize:'70px',fontFamily:'monospace'}}>{tick}</div><p>If this number moves, it's WORKING!</p></main>);
}
