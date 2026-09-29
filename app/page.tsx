"use client";
import { useEffect, useState } from "react";
export default function Home(){
const [p,setP]=useState("Loading...");
const [s,setS]=useState("Starting...");
useEffect(()=>{
let n=0;
const get=async()=>{
try{
n++; setS(`Fetch #${n}...`);
let r=await fetch("/api/tick",{cache:"no-store"});
let j=await r.json();
if(j.price){setP(Number(j.price).toFixed(2)); setS(`LIVE R_100 • ${new Date().toLocaleTimeString()}`)}
else setS(JSON.stringify(j));
}catch(e:any){setS(e.message)}
};
get();
let id=setInterval(get,2000);
return()=>clearInterval(id);
},[]);
return(<div style={{background:"#000",color:"#0F0",minHeight:"100vh",padding:20,fontFamily:"monospace"}}><h2>OMOSHFX • R_100</h2><p style={{color:"#0cc",fontSize:12}}>{s}</p><h1 style={{fontSize:50}}>Price: {p}</h1></div>)
}
