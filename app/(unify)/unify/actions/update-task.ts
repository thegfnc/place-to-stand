'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  taskId: z.string().uuid('Missing task id'),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z
    .enum([
      'backlog',
      'on_deck',
      'in_progress',
      'blocked',
      'awaiting_review',
      'done',
    ] as const)
    .optional(),
  assigneeId: z.string().uuid().optional().or(z.literal('')),
  reviewerId: z.string().uuid().optional().or(z.literal('')),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
})

export async function updateTask(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin', 'worker'])
    const supabase = await createSupabaseServerClient({
      allowCookieWrite: true,
    })
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message: fieldErrors.taskId?.[0] ?? 'Invalid task payload',
    }
  }

  const { taskId, ...rest } = parsed.data
  const updates: Record<string, unknown> = {}

  if (rest.title !== undefined) updates.title = rest.title
  if (rest.description !== undefined)
    updates.description = rest.description.length > 0 ? rest.description : null
  if (rest.status !== undefined) updates.status = rest.status
  if (rest.assigneeId !== undefined)
    updates.assignee_id = rest.assigneeId.length > 0 ? rest.assigneeId : null
  if (rest.reviewerId !== undefined)
    updates.reviewer_id = rest.reviewerId.length > 0 ? rest.reviewerId : null
  if (rest.dueDate !== undefined)
    updates.due_date = rest.dueDate.length > 0 ? rest.dueDate : null
  if (rest.startDate !== undefined)
    updates.start_date = rest.startDate.length > 0 ? rest.startDate : null

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)

  if (error) {
    console.error('Failed to update task', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Task updated successfully',
  }
}
