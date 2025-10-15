'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  projectId: z.string().uuid('Missing project id'),
  clientId: z.string().uuid('Missing client id'),
})

export async function deleteProject(formData: FormData) {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid project delete payload', parsed.error.flatten())
    return
  }

  const { projectId, clientId } = parsed.data

  const { error } = await supabase.from('projects').delete().eq('id', projectId)

  if (error) {
    console.error('Failed to delete project', error)
    return
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath('/unify/settings/projects')
  revalidatePath('/unify/settings/hours')
}
