import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Admin@12345'

export async function POST(request: Request) {
  const body = await request.json()
  const { username, password } = body

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('adminLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 
    })
    return response
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }
}