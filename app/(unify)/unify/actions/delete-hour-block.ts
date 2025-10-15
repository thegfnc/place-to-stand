'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'

const schema = z.object({
  hourBlockId: z.string().uuid('Missing hour block id'),
  projectId: z.string().uuid('Missing project id'),
  clientId: z.string().uuid('Missing client id'),
})

export async function deleteHourBlock(formData: FormData) {
  await requireProfile(['admin'])

  const supabase = await createSupabaseServerClient()
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    console.error('Invalid hour block delete payload', parsed.error.flatten())
    return
  }

  const { hourBlockId, projectId, clientId } = parsed.data

  const { error } = await supabase
    .from('project_hour_blocks')
    .delete()
    .eq('id', hourBlockId)

  if (error) {
    console.error('Failed to delete hour block', error)
    return
  }

  revalidatePath('/unify/clients')
  revalidatePath(`/unify/clients/${clientId}`)
  revalidatePath(`/unify/clients/${clientId}/projects/${projectId}`)
  revalidatePath('/unify/settings/hours')
}
