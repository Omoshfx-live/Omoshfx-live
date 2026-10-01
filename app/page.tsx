"use client";
import { useEffect, useState } from "react";

export default function Page(){
 const [tick,setTick]=useState("----.--");
 const [log,setLog]=useState("Connecting direct...");

 useEffect(()=>{
   let ws: WebSocket;
   const connect = ()=>{
     try{
       ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
       ws.onopen = ()=>{
         setLog(`LIVE REAL ✅ Direct to Deriv ${new Date().toLocaleTimeString()}`);
         ws.send(JSON.stringify({ticks:'R_100'}));
       };
       ws.onmessage = (e)=>{
         try{
           const d = JSON.parse(e.data);
           if(d.tick?.quote){
             setTick(Number(d.tick.quote).toFixed(2));
           }
         }catch{}
       };
       ws.onclose = ()=>{
         setLog("Reconnecting...");
         setTimeout(connect, 2000);
       };
       ws.onerror = ()=>{
         setLog("Error - retrying...");
       };
     }catch{
       setLog("Retrying...");
       setTimeout(connect, 2000);
     }
   };
   connect();
   return()=>{ try{ws.close()}catch{} };
 },[]);

 return(
   <main style={{background:"black",color:"white",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
     <h1 style={{fontSize:"48px",fontWeight:900}}>OmoshFX</h1>
     <p style={{color:"#4ade80",marginTop:"20px",fontSize:"12px"}}>{log}</p>
     <div style={{fontSize:"60px",fontFamily:"monospace",fontWeight:"bold",marginTop:"20px"}}>{tick}</div>
     <p style={{fontSize:"10px",opacity:0.4,marginTop:"10px"}}>Direct Real Deriv Feed</p>
   </main>
 )
}
