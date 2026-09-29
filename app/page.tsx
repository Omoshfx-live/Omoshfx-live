"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [price,setPrice]=useState(0);
const [status,setStatus]=useState("Waiting for token");
const [token,setToken]=useState("");
useEffect(()=>{
if(!token) return;
setStatus("CONNECTING...");
const ws=new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{ws.send(JSON.stringify({authorize:token}))};
ws.onmessage=(e)=>{
const d=JSON.parse(e.data);
if(d.msg_type==="authorize"){
if(d.error){setStatus("TOKEN ERROR: "+d.error.message); return}
setStatus("CONNECTED LIVE");
ws.send(JSON.stringify({ticks:"R_100",subscribe:1}));
}
if(d.tick){setPrice(d.tick.quote)}
};
ws.onerror=()=>setStatus("CONNECTION ERROR");
return ()=>ws.close();
},[token]);
return (<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:20,fontFamily:"monospace"}}>
<h1>OMOSHFX • R_100 LIVE</h1><p>Status: {status}</p><h2>Price: {price}</h2>
<input value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste Deriv Token here" style={{padding:10,width:"90%",marginTop:20,color:"#000"}}/>
<p style={{color:"#aaa",marginTop:10}}>omoshfx.site • Live</p></div>)}
