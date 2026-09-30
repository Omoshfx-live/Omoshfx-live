"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("No token - paste below");
  const [price, setPrice] = useState("---");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("deriv_token");
    if (saved) { setToken(saved); connect(saved); }
  }, []);

  const connect = (t: string) => {
    if (!t) return;
    setStatus("Connecting...");
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=1089");
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ authorize: t }));
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.error) { setStatus("Error: " + d.error.message); return; }
      if (d.msg_type === "authorize") {
        setStatus("Connected: " + d.authorize.loginid);
        ws.send(JSON.stringify({ ticks: "R_100", subscribe: 1 }));
      }
      if (d.msg_type === "tick") setPrice(d.tick.quote);
    };
    ws.onerror = () => setStatus("Failed - check token");
  };

  const save = () => {
    localStorage.setItem("deriv_token", token.trim());
    connect(token.trim());
  };

  return (
    <div style={{ background: "black", color: "#00ff41", minHeight: "100vh", padding: 24, fontFamily: "monospace" }}>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>OMOSHFX • R_100 LIVE</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{status}</div>
      <div style={{ fontSize: 54, fontWeight: "bold", marginTop: 30 }}>{price}</div>
      <div style={{ background: "#111", padding: 16, borderRadius: 10, marginTop: 40 }}>
        <div style={{ color: "white", fontSize: 12 }}>Deriv API Token:</div>
        <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste token here" style={{ width: "100%", padding: 12, marginTop: 8, background: "black", color: "white", border: "1px solid #333" }} />
        <button onClick={save} style={{ width: "100%", marginTop: 12, padding: 14, background: "#00ff41", color: "black", fontWeight: "bold", border: "none", borderRadius: 6 }}>SAVE & CONNECT</button>
      </div>
      <div style={{ fontSize: 10, color: "#555", marginTop: 20 }}>omoshfx-live.vercel.app</div>
    </div>
  );
}