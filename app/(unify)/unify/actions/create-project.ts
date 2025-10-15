'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import type { ActionState } from '@/src/lib/unify/types'

const schema = z.object({
  clientId: z.string().uuid('Select a client'),
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  code: z.string().max(16).optional(),
  summary: z.string().optional(),
  budgetHours: z
    .string()
    .optional()
    .transform(value => (value ? Number(value) : null))
    .pipe(z.number().nullable()),
})

export async function createProject(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireProfile(['admin'])
  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'error',
      message:
        fieldErrors.name?.[0] ?? fieldErrors.clientId?.[0] ?? 'Invalid project',
    }
  }

  const { clientId, name, code, summary, budgetHours } = parsed.data

  const { error } = await supabase.from('projects').insert({
    client_id: clientId,
    name,
    code: code?.trim() || null,
    summary: summary?.trim() || null,
    budget_hours: budgetHours ?? null,
    created_by: profile.id,
  })

  if (error) {
    console.error('Failed to create project', error)
    return {
      status: 'error',
      message: error.message,
    }
  }

  revalidatePath('/unify')

  return {
    status: 'success',
    message: 'Project created successfully',
  }
}
