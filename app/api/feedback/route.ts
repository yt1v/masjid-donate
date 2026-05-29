import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

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
  const body = await req.json()
  const { name, message, type, recaptchaToken } = body

  if (!message || !type) {
    return NextResponse.json({ error: 'Message and type are required.' }, { status: 400 })
  }
  if (message.length > 500) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 })
  }
  if (!['comment', 'report', 'suggestion'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
  }

  const valid = await verifyRecaptcha(recaptchaToken)
  if (!valid) {
    return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 })
  }

  const { error } = await getSupabaseAdmin().from('feedback').insert([{
    name: name || null,
    message,
    type,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  const { data, error } = await getSupabaseAdmin()
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
