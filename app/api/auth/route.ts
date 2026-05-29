import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const SESSION_COOKIE = 'masjid_admin_session'

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: NextRequest) {
  const { password, recaptchaToken } = await req.json()

  const valid = await verifyRecaptcha(recaptchaToken)
  if (!valid) {
    return NextResponse.json({ error: 'reCAPTCHA verification failed.' }, { status: 400 })
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return NextResponse.json({ authenticated: session?.value === 'authenticated' })
}
