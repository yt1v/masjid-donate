import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('donations')
    .select('*')
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const body = await req.json()
  const { data, error } = await getSupabaseAdmin().from('donations').insert([{
    donor_name: body.is_anonymous ? null : (body.donor_name || null),
    is_anonymous: body.is_anonymous ?? false,
    amount: body.amount,
    source: body.source,
    transaction_id: body.transaction_id || null,
    date: body.date,
    notes: body.notes || null,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await getSupabaseAdmin().from('donations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
