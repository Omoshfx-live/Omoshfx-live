"use client";
import { useEffect, useState } from "react";

export default function Page(){
 const [tick,setTick]=useState("----.--");
 const [log,setLog]=useState("Connecting to real Deriv...");

 useEffect(()=>{
   const fetchReal = async()=>{
     try{
       const r = await fetch('/api/live',{cache:'no-store'});
       const j = await r.json();
       if(j.price){
         setTick(Number(j.price).toFixed(2));
         setLog(`LIVE REAL ✅ R_100 ${new Date().toLocaleTimeString()}`);
       }
     }catch{
       setLog("Retrying...");
     }
   };
   fetchReal();
   const id=setInterval(fetchReal, 400);
   return()=>clearInterval(id);
 },[]);

 return(
   <main style={{background:"black",color:"white",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
     <h1 style={{fontSize:"48px",fontWeight:900}}>OmoshFX</h1>
     <p style={{color:"#4ade80",marginTop:"20px"}}>{log}</p>
     <div style={{fontSize:"60px",fontFamily:"monospace",fontWeight:"bold",marginTop:"20px"}}>{tick}</div>
     <p style={{fontSize:"10px",opacity:0.4,marginTop:"10px"}}>Real Deriv via Vercel bypass</p>
   </main>
 )
}
