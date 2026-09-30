import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 400 })
  }

  // For now return ok - your frontend will use token directly via WebSocket
  return NextResponse.json({ 
    ok: true, 
    token: token.substring(0,4) + '...',
    message: 'Token received, connecting to Deriv...' 
  })
}
