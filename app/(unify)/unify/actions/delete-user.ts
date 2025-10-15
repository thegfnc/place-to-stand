'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from '@/src/lib/supabase/clients'

const schema = z.object({
  profileId: z.string().uuid('Missing profile id'),
})

export async function deleteUser(formData: FormData) {
  const currentProfile = await requireProfile(['admin'])

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid user delete payload', parsed.error.flatten())
    return
  }

  const { profileId } = parsed.data

  if (currentProfile.id === profileId) {
    console.warn('Admins cannot remove their own account from settings')
    return
  }

  const serviceClient = createSupabaseServiceRoleClient()
  const { error } = await serviceClient.auth.admin.deleteUser(profileId)

  if (error) {
    console.error('Failed to delete user', error)
    return
  }

  const supabase = await createSupabaseServerClient()
  await supabase.from('profiles').delete().eq('id', profileId)

  revalidatePath('/unify/clients')
  revalidatePath('/unify/settings/team')
}
