'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  profileId: z.string().uuid('Missing profile id'),
})

export async function deleteUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const currentProfile = await requireProfile(['admin'])

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid user delete payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message: fieldErrors.profileId?.[0] ?? 'Invalid user payload',
    }
  }

  const { profileId } = parsed.data

  if (currentProfile.id === profileId) {
    console.warn('Admins cannot remove their own account from settings')
    return {
      status: 'error',
      message: 'You cannot remove your own administrator account.',
    }
  }

  const serviceClient = createSupabaseServiceRoleClient()
  const { error } = await serviceClient.auth.admin.deleteUser(profileId)

  if (error) {
    console.error('Failed to delete user', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  await supabase.from('profiles').delete().eq('id', profileId)

  revalidatePath('/unify/clients')
  revalidatePath('/unify/settings/team')

  return {
    status: 'success',
    message: 'Team member removed successfully',
  }
}
