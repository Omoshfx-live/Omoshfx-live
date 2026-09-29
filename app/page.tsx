"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [price, setPrice] = useState("Loading R_100...");
  const [status, setStatus] = useState("Connecting via API...");

  useEffect(() => {
    let id: any;
    async function getPrice() {
      try {
        const res = await fetch("/api/tick", { cache: "no-store" });
        const data = await res.json();
        if (data.price) {
          setPrice(data.price.toString());
          setStatus("LIVE • " + new Date().toLocaleTimeString());
        } else {
          setStatus("Error: " + (data.error || "unknown"));
        }
      } catch (e: any) {
        setStatus("Retrying...");
      }
    }
    getPrice();
    id = setInterval(getPrice, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "black", color: "#00FF41", minHeight: "100vh", padding: "24px", fontFamily: "monospace" }}>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>OMOSHFX • R_100 LIVE</div>
      <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>{status}</div>
      <div style={{ marginTop: "20px", fontSize: "48px", fontWeight: "bold", lineHeight: "1.1" }}>
        Price:<br />{price}
      </div>
      <div style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>omoshfx.site • Live • No token</div>
    </div>
  );
}
