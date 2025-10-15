'use server'

import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignInState = {
  error?: string | null
}

export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const payload = Object.fromEntries(formData.entries())
  const parsed = signInSchema.safeParse(payload)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors

    return {
      error: errors.email?.[0] ?? errors.password?.[0] ?? 'Invalid credentials',
    }
  }

  const { email, password } = parsed.data
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/unify' as Route)
}
