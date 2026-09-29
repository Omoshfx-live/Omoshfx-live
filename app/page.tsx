"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [price,setPrice]=useState(0);
const [status,setStatus]=useState("CONNECTING");
const [token,setToken]=useState("");
useEffect(()=>{
const ws=new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
ws.onopen=()=>{ws.send(JSON.stringify({ticks:"R_100",subscribe:1}));setStatus("LIVE");};
ws.onmessage=(e)=>{const d=JSON.parse(e.data);if(d.tick) setPrice(d.tick.quote);};
return ()=>ws.close();
},[]);
return (<div style={{background:"#000",color:"#0f0",minHeight:"100vh",padding:20,fontFamily:"monospace"}}><h1>OMOSHFX • R_100 LIVE</h1><p>Status: {status}</p><h2 style={{fontSize:48}}>{price||"----"}</h2><input placeholder="Deriv API Token" value={token} onChange={e=>setToken(e.target.value)} style={{padding:10,width:"90%",marginTop:20}}/><p style={{color:"#aaa",marginTop:10}}>omoshfx.site • Live from Deriv</p></div>);
}