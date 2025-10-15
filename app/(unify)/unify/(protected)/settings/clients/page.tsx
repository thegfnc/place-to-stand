import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import {
  ClientsAddButton,
  ClientsTable,
} from '@/src/components/unify/settings/clients-table'
import type { ClientsRow, ProjectsRow } from '@/src/lib/supabase/types'

export default async function SettingsClientsPage() {
  const supabase = await createSupabaseServerClient()

  const [clientsResponse, projectsResponse] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, status, notes, created_at, updated_at')
      .order('name'),
    supabase.from('projects').select('id, client_id'),
  ])

  if (clientsResponse.error) {
    throw new Error(clientsResponse.error.message)
  }

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message)
  }

  const clients = (clientsResponse.data ?? []) as Array<
    Pick<ClientsRow, 'id' | 'name' | 'status' | 'notes'>
  >

  const projects = (projectsResponse.data ?? []) as Array<
    Pick<ProjectsRow, 'id' | 'client_id'>
  >

  const projectCounts = projects.reduce<Record<string, number>>(
    (acc, project) => {
      acc[project.client_id] = (acc[project.client_id] ?? 0) + 1
      return acc
    },
    {}
  )

  const tableData = clients
    .map(client => ({
      id: client.id,
      name: client.name,
      status: client.status,
      notes: client.notes,
      projectCount: projectCounts[client.id] ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className='space-y-8'>
      <UnifyPanel
        title='Create a client'
        description='Stand up a new client record with optional internal notes.'
        actions={<ClientsAddButton />}
      >
        <p className='text-sm text-slate-400'>
          Use the add client dialog to capture new partners without leaving this
          view.
        </p>
      </UnifyPanel>

      <UnifyPanel
        title='Client registry'
        description='Update statuses, notes, and clean up records as relationships evolve.'
      >
        <ClientsTable clients={tableData} />
      </UnifyPanel>
    </div>
  )
}
