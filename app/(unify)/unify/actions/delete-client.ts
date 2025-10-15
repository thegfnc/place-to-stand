'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  clientId: z.string().uuid('Missing client id'),
})

export async function deleteClient(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid client delete payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message: fieldErrors.clientId?.[0] ?? 'Invalid client payload',
    }
  }

  const { clientId } = parsed.data

  const { error } = await supabase.from('clients').delete().eq('id', clientId)

  if (error) {
    console.error('Failed to delete client', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify/clients')
  revalidatePath('/unify/settings/clients')
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')

  return {
    status: 'success',
    message: 'Client deleted successfully',
  }
}
