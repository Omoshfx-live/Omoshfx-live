"use client";
import { useEffect, useState, useRef } from "react";

const APP_ID = "34xKG4eHvhL98iEb64Qdf";

export default function Home() {
  const [tick, setTick] = useState("----.--");
  const [status, setStatus] = useState("Connecting...");
  const [balance, setBalance] = useState("0.00");
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState("Not Connected");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("deriv_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    const connect = () => {
      setStatus("Connecting...");
      ws.current = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${APP_ID}`);
      
      ws.current.onopen = () => {
        setStatus("LIVE ✅ R_100");
        ws.current?.send(JSON.stringify({ ticks: "R_100" }));
        const saved = localStorage.getItem("deriv_token");
        if (saved) {
          ws.current?.send(JSON.stringify({ authorize: saved }));
        }
      };
      
      ws.current.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.tick) setTick(data.tick.quote);
        if (data.authorize) {
          setAuth(`Connected ✅ ${data.authorize.logininfo?.email || ''}`);
          setBalance(data.authorize.balance?.toString() || "0");
        }
        if (data.error) {
          if (data.error.code === "InvalidToken") {
            setAuth(`Token Failed: ${data.error.message}`);
          }
        }
      };
      
      ws.current.onclose = () => {
        setStatus("Reconnecting...");
        setTimeout(connect, 2000);
      };
    };
    connect();
    return () => ws.current?.close();
  }, []);

  const saveToken = () => {
    localStorage.setItem("deriv_token", token.trim());
    if (ws.current?.readyState === 1) {
      ws.current.send(JSON.stringify({ authorize: token.trim() }));
      setAuth("Checking token...");
    } else {
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-black mb-2">OmoshFX</h1>
      <p className="text-green-400 mb-4">{status}</p>
      <div className="text-6xl font-mono my-6">{tick}</div>
      <p className="mb-6">Balance: ${balance} | {auth}</p>
      
      <div className="w-full max-w-sm bg-zinc-900 p-4 rounded-xl">
        <input 
          value={token} 
          onChange={e=>setToken(e.target.value)}
          placeholder="Paste Deriv API Token here"
          className="w-full p-3 rounded bg-black border border-zinc-700 mb-3"
        />
        <button onClick={saveToken} className="w-full bg-white text-black font-bold py-3 rounded">
          SAVE & CONNECT
        </button>
        <p className="text-xs text-zinc-500 mt-2 text-center">Get token from: app.deriv.com/account/api-token</p>
      </div>
      
      <a href="https://omoshfx-live.vercel.app" className="mt-8 text-xs text-zinc-600">https://omoshfx-live.vercel.app</a>
    </main>
  );
}
