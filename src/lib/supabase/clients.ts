import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function ensureEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`)
  }
  return value
}

export function createSupabaseClient() {
  return createClient<Database>(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    ensureEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey)
  )
}

export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    ensureEnv('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceKey),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    ensureEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
}
