'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  taskId: z.string().uuid('Missing task id'),
})

export type DeleteTaskInput = z.infer<typeof schema>

export async function deleteTask(input: DeleteTaskInput) {
  await requireProfile(['admin', 'worker'])
  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  const parsed = schema.safeParse(input)

  if (!parsed.success) {
    throw new Error(
      parsed.error.flatten().fieldErrors.taskId?.[0] ?? 'Invalid delete payload'
    )
  }

  const { taskId } = parsed.data
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) {
    console.error('Failed to delete task', error)
    throw error
  }

  revalidatePath('/unify')
}
