import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()

  const redirectUrl = new URL('/unify/login', request.url)
  redirectUrl.searchParams.set('status', 'signed-out')

  return NextResponse.redirect(redirectUrl, {
    status: 303,
  })
}
