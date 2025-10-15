'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  hourBlockId: z.string().uuid('Missing hour block id'),
  projectId: z.string().uuid('Missing project id'),
  clientId: z.string().uuid('Missing client id'),
  purchasedHours: z
    .string()
    .min(1)
    .transform(value => Number(value))
    .pipe(z.number().positive('Hours must be greater than zero')),
  effectiveDate: z.string().optional(),
  note: z.string().optional(),
})

export async function updateHourBlock(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid hour block update payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.purchasedHours?.[0] ??
        fieldErrors.projectId?.[0] ??
        'Invalid hour block payload',
    }
  }

  const {
    hourBlockId,
    projectId,
    clientId,
    purchasedHours,
    effectiveDate,
    note,
  } = parsed.data

  const fallbackDate = new Date().toISOString().slice(0, 10)

  const { error } = await supabase
    .from('project_hour_blocks')
    .update({
      project_id: projectId,
      purchased_hours: purchasedHours,
      effective_date:
        effectiveDate && effectiveDate.length > 0
          ? effectiveDate
          : fallbackDate,
      note: note?.trim() ? note.trim() : null,
    })
    .eq('id', hourBlockId)

  if (error) {
    console.error('Failed to update hour block', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath(`/unify/clients/${clientId}/projects/${projectId}`)
  revalidatePath('/unify/settings/hours')
  return {
    status: 'success',
    message: 'Hour block updated successfully',
  }
}
