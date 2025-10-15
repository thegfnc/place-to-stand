'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  taskId: z.string().uuid('Missing task id'),
  status: z.enum([
    'backlog',
    'on_deck',
    'in_progress',
    'blocked',
    'awaiting_review',
    'done',
  ] as const),
  position: z.number(),
})

export type MoveTaskInput = z.infer<typeof schema>

export async function moveTask(input: MoveTaskInput) {
  const profile = await requireProfile(['admin', 'worker'])
  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  const parsed = schema.safeParse(input)

  if (!parsed.success) {
    throw new Error(
      parsed.error.flatten().fieldErrors.taskId?.[0] ?? 'Invalid move payload'
    )
  }

  const { taskId, status, position } = parsed.data

  const { data: existingTask, error: fetchError } = await supabase
    .from('tasks')
    .select('status')
    .eq('id', taskId)
    .maybeSingle()

  if (fetchError) {
    console.error('Failed to fetch task before move', fetchError)
    throw fetchError
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status, position })
    .eq('id', taskId)

  if (error) {
    console.error('Failed to move task', error)
    throw error
  }

  if (existingTask?.status && existingTask.status !== status) {
    const { error: historyError } = await supabase
      .from('task_status_history')
      .insert({
        task_id: taskId,
        previous_status: existingTask.status,
        new_status: status,
        changed_by: profile.id,
      })

    if (historyError) {
      console.error('Failed to log status change', historyError)
    }
  }

  revalidatePath('/unify')
}
