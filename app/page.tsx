'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('Waiting for token')
  const [price, setPrice] = useState('--')

  useEffect(() => {
    const saved = localStorage.getItem('deriv_token')
    if (saved) setToken(saved)
  }, [])

  const connect = () => {
    if (!token) return setStatus('Failed - check token')
    localStorage.setItem('deriv_token', token)
    setStatus('Connecting...')

    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089')

    ws.onopen = () => {
      ws.send(JSON.stringify({ authorize: token }))
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.error) {
        setStatus('Failed - ' + data.error.message)
      }
      if (data.authorize) {
        setStatus('Connected ✅ - ' + data.authorize.loginid)
        ws.send(JSON.stringify({ ticks: 'R_100' }))
      }
      if (data.tick) {
        setPrice(data.tick.quote)
      }
    }

    ws.onerror = () => setStatus('Failed - check token')
  }

  return (
    <div style={{ background: 'black', color: '#00ff00', minHeight: '100vh', padding: 20, fontFamily: 'monospace' }}>
      <h2>OMOSHFX • R_100 LIVE</h2>
      <p>{status}</p>
      <p style={{ fontSize: 40 }}>{price}</p>
      
      <div style={{ background: '#111', padding: 15, borderRadius: 10, marginTop: 20 }}>
        <div>Deriv API Token:</div>
        <input 
          value={token} 
          onChange={e => setToken(e.target.value)}
          style={{ width: '100%', padding: 10, margin: '10px 0', background: 'black', color: 'white', border: '1px solid #333' }}
          type="password"
        />
        <button 
          onClick={connect}
          style={{ width: '100%', padding: 12, background: '#00ff00', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: 5 }}
        >
          SAVE & CONNECT
        </button>
      </div>
      <p style={{ fontSize: 10, opacity: 0.5, marginTop: 10 }}>omoshfx-live.vercel.app</p>
    </div>
  )
}
