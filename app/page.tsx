"use client";
import { useEffect, useState, useRef } from "react";
const APP_ID = 1089;
export default function Home() {
  const [tick, setTick] = useState("----.--");
  const [status, setStatus] = useState("Connecting...");
  const [balance, setBalance] = useState("0.00");
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState("Not Connected");
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    const s = localStorage.getItem("deriv_token");
    if (s) setToken(s);
  }, []);
  useEffect(() => {
    const connect = () => {
      setStatus("Connecting...");
      ws.current = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);
      ws.current.onopen = () => {
        setStatus("LIVE ✅ R_100");
        ws.current?.send(JSON.stringify({ ticks: "R_100" }));
        const saved = localStorage.getItem("deriv_token");
        if (saved) ws.current?.send(JSON.stringify({ authorize: saved.trim() }));
      };
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.tick) setTick(data.tick.quote);
        if (data.authorize) {
          setAuth("Connected ✅");
          setBalance(data.authorize.balance?.toString() || "0");
        }
        if (data.error) setAuth(data.error.message);
      };
      ws.current.onclose = () => setTimeout(connect, 2000);
    };
    connect();
    return () => ws.current?.close();
  }, []);
  const save = () => {
    localStorage.setItem("deriv_token", token.trim());
    location.reload();
  };
  return (
    <main style={{minHeight:'100vh', background:'black', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <h1 style={{fontSize:'40px', fontWeight:'900'}}>OmoshFX</h1>
      <p style={{color:'#4ade80', margin:'10px'}}>{status}</p>
      <div style={{fontSize:'60px', fontFamily:'monospace', margin:'20px'}}>{tick}</div>
      <p>Balance: ${balance} | {auth}</p>
      <div style={{marginTop:'20px', width:'100%', maxWidth:'360px'}}>
        <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste NEW Deriv Token" style={{width:'100%', padding:'12px', background:'#111', border:'1px solid #333', color:'white', borderRadius:'8px'}} />
        <button onClick={save} style={{width:'100%', marginTop:'10px', padding:'12px', background:'white', color:'black', fontWeight:'bold', borderRadius:'8px'}}>SAVE & CONNECT</button>
      </div>
    </main>
  );
}
