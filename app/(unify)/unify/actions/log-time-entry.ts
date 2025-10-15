'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  taskId: z.string().uuid('Select a task'),
  hours: z
    .string()
    .min(1)
    .transform(value => Number(value))
    .pipe(z.number().positive('Hours must be greater than zero')),
  entryDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function logTimeEntry(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireProfile(['admin', 'worker'])
  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.hours?.[0] ?? fieldErrors.taskId?.[0] ?? 'Invalid entry',
    }
  }

  const { taskId, hours, entryDate, notes } = parsed.data
  const minutes = Math.round(hours * 60)

  const { error } = await supabase.from('time_entries').insert({
    task_id: taskId,
    person_id: profile.id,
    minutes,
    entry_date: entryDate && entryDate.length > 0 ? entryDate : undefined,
    notes: notes?.trim() || null,
  })

  if (error) {
    console.error('Failed to log time entry', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Time entry logged',
  }
}
