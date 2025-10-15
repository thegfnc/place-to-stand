'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters long'),
  notes: z.string().optional(),
})

export async function createClient(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireProfile(['admin'])
  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    return {
      status: 'error',
      message:
        parsed.error.flatten().fieldErrors.name?.[0] ?? 'Invalid client data',
    }
  }

  const { name, notes } = parsed.data

  const { error } = await supabase.from('clients').insert({
    name,
    notes: notes?.trim() || null,
    created_by: profile.id,
  })

  if (error) {
    console.error('Failed to create client', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Client created successfully',
  }
}
