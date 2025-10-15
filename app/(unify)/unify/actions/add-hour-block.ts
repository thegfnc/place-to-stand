'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  projectId: z.string().uuid('Select a project'),
  purchasedHours: z
    .string()
    .min(1)
    .transform(value => Number(value))
    .pipe(z.number().positive('Hours must be greater than zero')),
  effectiveDate: z.string().optional(),
  note: z.string().optional(),
})

export async function addHourBlock(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireProfile(['admin'])
  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.purchasedHours?.[0] ??
        fieldErrors.projectId?.[0] ??
        'Invalid hour block',
    }
  }

  const { projectId, purchasedHours, effectiveDate, note } = parsed.data

  const { error } = await supabase.from('project_hour_blocks').insert({
    project_id: projectId,
    purchased_hours: purchasedHours,
    effective_date:
      effectiveDate && effectiveDate.length > 0 ? effectiveDate : undefined,
    note: note?.trim() || null,
    recorded_by: profile.id,
  })

  if (error) {
    console.error('Failed to add hour block', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Hour block added successfully',
  }
}
