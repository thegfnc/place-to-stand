'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  clientId: z.string().uuid('Missing client id'),
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  status: z.string().min(2),
  notes: z.string().optional(),
})

export async function updateClient(formData: FormData) {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid client update payload', parsed.error.flatten())
    return
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
    return
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath('/unify/settings/clients')
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')
}
