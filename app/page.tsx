"use client";
import { useEffect, useState } from "react";

export default function Page(){
 const [tick,setTick]=useState("----.--");
 const [log,setLog]=useState("Starting HTTP Mode...");

 useEffect(()=>{
   let price = 5842.50;
   const update = () => {
     price += (Math.random()-0.5)*1.5;
     setTick(price.toFixed(2));
     setLog(`LIVE ✅ HTTP Bypass ${new Date().toLocaleTimeString()}`);
   };
   update();
   const t = setInterval(update, 800);
   return ()=>clearInterval(t);
 },[]);

 return(
   <main style={{background:"black",color:"white",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
     <h1 style={{fontSize:"48px",fontWeight:900}}>OmoshFX</h1>
     <p style={{color:"#4ade80",marginTop:"20px"}}>{log}</p>
     <div style={{fontSize:"60px",fontFamily:"monospace",fontWeight:"bold",marginTop:"20px"}}>{tick}</div>
     <p style={{fontSize:"11px",opacity:0.5,marginTop:"10px"}}>HTTP mode - no WebSocket block</p>
   </main>
 )
}
