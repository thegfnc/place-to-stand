'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  clientId: z.string().uuid('Missing client id'),
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  status: z.string().min(2),
  notes: z.string().optional(),
})

export async function updateClient(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid client update payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.name?.[0] ??
        fieldErrors.status?.[0] ??
        'Invalid client payload',
    }
  }

  const { clientId, name, status, notes } = parsed.data

  const { error } = await supabase
    .from('clients')
    .update({
      name,
      status,
      notes: notes?.trim() ? notes.trim() : null,
    })
    .eq('id', clientId)

  if (error) {
    console.error('Failed to update client', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath('/unify/settings/clients')
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')
  return {
    status: 'success',
    message: 'Client updated successfully',
  }
}
