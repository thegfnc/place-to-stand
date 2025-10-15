'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  profileId: z.string().uuid('Missing profile id'),
  fullName: z.string().optional(),
  role: z.enum(['admin', 'worker', 'client']),
})

export async function updateProfile(formData: FormData) {
  const currentProfile = await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid profile update payload', parsed.error.flatten())
    return
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
    return
  }

  if (currentProfile.id === profileId) {
    revalidatePath('/unify')
  }

  revalidatePath('/unify/clients')
  revalidatePath('/unify/settings/team')
}
