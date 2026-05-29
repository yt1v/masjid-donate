import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'masjid_admin_session'

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
