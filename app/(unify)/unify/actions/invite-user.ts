'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { createUserWithRole, requireProfile } from '@/src/lib/auth/session'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'worker', 'client'] as const),
  password: z
    .string()
    .min(8, 'Temporary password must be at least 8 characters')
    .max(64, 'Password is too long'),
})

export async function inviteUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.email?.[0] ??
        fieldErrors.password?.[0] ??
        fieldErrors.role?.[0] ??
        'Invalid invitation fields',
    }
  }

  const { email, fullName, role, password } = parsed.data

  try {
    const user = await createUserWithRole({
      email,
      password,
      fullName,
      role,
    })

    if (!user?.id) {
      throw new Error('Supabase did not return a user id')
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        role,
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Failed to invite user', error)

    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to invite user',
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Invitation created successfully',
  }
}
