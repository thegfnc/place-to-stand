'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  profileId: z.string().uuid('Missing profile id'),
  fullName: z.string().optional(),
  role: z.enum(['admin', 'worker', 'client']),
})

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const currentProfile = await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid profile update payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.fullName?.[0] ??
        fieldErrors.role?.[0] ??
        'Invalid profile payload',
    }
  }

  const { profileId, fullName, role } = parsed.data

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName?.trim() ? fullName.trim() : null,
      role,
    })
    .eq('id', profileId)

  if (error) {
    console.error('Failed to update profile', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  if (currentProfile.id === profileId) {
    revalidatePath('/unify')
  }

  revalidatePath('/unify/clients')
  revalidatePath('/unify/settings/team')
  return {
    status: 'success',
    message: 'Team member updated successfully',
  }
}
