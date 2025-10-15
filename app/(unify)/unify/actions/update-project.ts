'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  projectId: z.string().uuid('Missing project id'),
  clientId: z.string().uuid('Select a client'),
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  status: z.string().min(2),
  summary: z.string().optional(),
  code: z.string().optional(),
  budgetHours: z
    .string()
    .optional()
    .transform(value => (value && value.length > 0 ? Number(value) : null))
    .pipe(z.number().nullable()),
})

export async function updateProject(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid project update payload', parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.name?.[0] ??
        fieldErrors.clientId?.[0] ??
        fieldErrors.status?.[0] ??
        'Invalid project payload',
    }
  }

  const { projectId, clientId, name, status, summary, code, budgetHours } =
    parsed.data

  const { error } = await supabase
    .from('projects')
    .update({
      client_id: clientId,
      name,
      status,
      summary: summary?.trim() ? summary.trim() : null,
      code: code?.trim() ? code.trim() : null,
      budget_hours: budgetHours,
    })
    .eq('id', projectId)

  if (error) {
    console.error('Failed to update project', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath(`/unify/clients/${clientId}/projects/${projectId}`)
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')
  return {
    status: 'success',
    message: 'Project updated successfully',
  }
}
