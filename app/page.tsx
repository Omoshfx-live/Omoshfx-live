'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [token,setToken]=useState('')
  const [status,setStatus]=useState('Connecting to R_100...')
  const [price,setPrice]=useState('--')

  useEffect(()=>{
    const s=localStorage.getItem('deriv_token')
    if(s) setToken(s)
    const ws=new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089')
    ws.onopen=()=>{ ws.send(JSON.stringify({ticks:'R_100'})) }
    ws.onmessage=(m)=>{
      const d=JSON.parse(m.data)
      if(d.tick){ setPrice(d.tick.quote); setStatus('LIVE ✅ R_100') }
    }
  },[])

  const connect=()=>{
    localStorage.setItem('deriv_token',token)
    const ws=new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089')
    ws.onopen=()=> ws.send(JSON.stringify({authorize:token}))
    ws.onmessage=(m)=>{
      const d=JSON.parse(m.data)
      if(d.error){ setStatus('Token Failed: '+d.error.message) }
      if(d.authorize){ setStatus('Connected ✅ '+d.authorize.loginid+' | '+price) }
    }
    ws.onerror=()=> setStatus('Failed - token wrong, but price still live')
  }

  return(
    <div style={{background:'black',color:'#0f0',minHeight:'100vh',padding:20,fontFamily:'monospace'}}>
      <h2>OMOSHFX • R_100 LIVE</h2>
      <p>{status}</p>
      <p style={{fontSize:50}}>{price}</p>
      <div style={{background:'#111',padding:15,borderRadius:10,marginTop:20}}>
        <div>Deriv API Token:</div>
        <input value={token} onChange={e=>setToken(e.target.value)} style={{width:'100%',padding:10,margin:'10px 0',background:'black',color:'white',border:'1px solid #333'}} type="password"/>
        <button onClick={connect} style={{width:'100%',padding:12,background:'#0f0',color:'black',fontWeight:'bold',border:'none'}}>SAVE & CONNECT</button>
      </div>
      <p style={{fontSize:10,opacity:0.5,marginTop:20}}>omoshfx-live.vercel.app - LIVE</p>
    </div>
  )
}
