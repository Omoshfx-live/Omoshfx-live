"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [tick, setTick] = useState("----.--");
  const [log, setLog] = useState("Starting...");
  useEffect(() => {
    setLog("Connecting to Deriv...");
    const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    ws.onopen = () => {
      setLog("Connected ✅ Waiting for ticks...");
      ws.send(JSON.stringify({ ticks: "R_100" }));
    };
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.tick) {
        setTick(d.tick.quote.toString());
        setLog("LIVE ✅ " + d.tick.symbol);
      }
      if (d.error) setLog("ERROR: " + d.error.message);
    };
    ws.onerror = () => setLog("WebSocket Error ❌ Try mobile data");
    ws.onclose = () => setLog("Closed - refreshing in 3s");
    return () => ws.close();
  }, []);
  return (
    <main style={{background:'black',color:'white',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{fontSize:'48px',fontWeight:'900'}}>OmoshFX</h1>
      <p style={{color:'#4ade80',margin:'20px'}}>{log}</p>
      <div style={{fontSize:'64px',fontFamily:'monospace',fontWeight:'bold'}}>{tick}</div>
    </main>
  );
}
