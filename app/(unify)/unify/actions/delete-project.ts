'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  projectId: z.string().uuid('Missing project id'),
  clientId: z.string().uuid('Missing client id'),
})

export async function deleteProject(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient({
    allowCookieWrite: true,
  })
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid project delete payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.projectId?.[0] ??
        fieldErrors.clientId?.[0] ??
        'Invalid project payload',
    }
  }

  const { projectId, clientId } = parsed.data

  const { error } = await supabase.from('projects').delete().eq('id', projectId)

  if (error) {
    console.error('Failed to delete project', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')

  return {
    status: 'success',
    message: 'Project deleted successfully',
  }
}
