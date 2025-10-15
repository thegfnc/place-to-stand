'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  projectId: z.string().uuid('Select a project'),
  status: z
    .enum([
      'backlog',
      'on_deck',
      'in_progress',
      'blocked',
      'awaiting_review',
      'done',
    ] as const)
    .default('backlog'),
  assigneeId: z.string().uuid().optional().or(z.literal('')),
  reviewerId: z.string().uuid().optional().or(z.literal('')),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  description: z.string().optional(),
})

export async function createTask(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireProfile(['admin', 'worker'])
    const supabase = await createSupabaseServerClient({
      allowCookieWrite: true,
    })
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.title?.[0] ?? fieldErrors.projectId?.[0] ?? 'Invalid task',
    }
  }

  const {
    title,
    projectId,
    status,
    assigneeId,
    reviewerId,
    dueDate,
    startDate,
    description,
  } = parsed.data

  const position = Date.now()

  const { error } = await supabase.from('tasks').insert({
    title,
    project_id: projectId,
    status,
    assignee_id: assigneeId && assigneeId.length > 0 ? assigneeId : null,
    reviewer_id: reviewerId && reviewerId.length > 0 ? reviewerId : null,
    due_date: dueDate && dueDate.length > 0 ? dueDate : null,
    start_date: startDate && startDate.length > 0 ? startDate : null,
    description: description && description.length > 0 ? description : null,
    position,
    created_by: profile.id,
  })

  if (error) {
    console.error('Failed to create task', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Task created successfully',
  }
}
