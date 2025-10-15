import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import {
  ProjectsAddButton,
  ProjectsTable,
} from '@/src/components/unify/settings/projects-table'
import type {
  ClientsRow,
  ProjectsRow,
  TaskRow,
  TimeEntryRow,
} from '@/src/lib/supabase/types'

export default async function SettingsProjectsPage() {
  const supabase = await createSupabaseServerClient()

  const [
    clientsResponse,
    projectsResponse,
    tasksResponse,
    timeEntriesResponse,
  ] = await Promise.all([
    supabase.from('clients').select('id, name').order('name'),
    supabase
      .from('projects')
      .select(
        `
            id,
            name,
            status,
            summary,
            code,
            budget_hours,
            client_id,
            client:clients ( id, name ),
            project_hour_blocks ( purchased_hours )
          `
      )
      .order('name'),
    supabase
      .from('tasks')
      .select('id, project_id')
      .order('created_at', { ascending: false }),
    supabase
      .from('time_entries')
      .select('id, task_id, minutes')
      .order('entry_date', { ascending: false }),
  ])

  if (clientsResponse.error) {
    throw new Error(clientsResponse.error.message)
  }

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message)
  }

  if (tasksResponse.error) {
    throw new Error(tasksResponse.error.message)
  }

  if (timeEntriesResponse.error) {
    throw new Error(timeEntriesResponse.error.message)
  }

  const clients = (clientsResponse.data ?? []) as Array<
    Pick<ClientsRow, 'id' | 'name'>
  >

  const projects = (projectsResponse.data ?? []) as Array<
    Pick<
      ProjectsRow,
      | 'id'
      | 'name'
      | 'status'
      | 'summary'
      | 'code'
      | 'budget_hours'
      | 'client_id'
    > & {
      client?: { id: string; name: string } | null
      project_hour_blocks?: Array<{ purchased_hours: number | null }>
    }
  >

  const tasks = (tasksResponse.data ?? []) as Array<
    Pick<TaskRow, 'id' | 'project_id'>
  >

  const timeEntries = (timeEntriesResponse.data ?? []) as Array<
    Pick<TimeEntryRow, 'id' | 'task_id' | 'minutes'>
  >

  const clientOptions = clients.sort((a, b) => a.name.localeCompare(b.name))

  const taskProjectMap = new Map<string, string>()

  tasks.forEach(task => {
    if (task.project_id) {
      taskProjectMap.set(task.id, task.project_id)
    }
  })

  const timeByProject = new Map<string, number>()

  timeEntries.forEach(entry => {
    const minutes = entry.minutes ?? 0
    const projectId = taskProjectMap.get(entry.task_id)
    if (projectId) {
      timeByProject.set(
        projectId,
        (timeByProject.get(projectId) ?? 0) + minutes
      )
    }
  })

  const tableData = projects
    .map(project => {
      const purchasedHours = (project.project_hour_blocks ?? []).reduce(
        (total, block) => total + Number(block.purchased_hours ?? 0),
        0
      )

      const loggedMinutes = timeByProject.get(project.id) ?? 0

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        summary: project.summary,
        code: project.code,
        budgetHours: project.budget_hours ?? null,
        clientId: project.client_id,
        clientName: project.client?.name ?? 'Unassigned',
        purchasedHours,
        loggedHours: loggedMinutes / 60,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className='space-y-8'>
      <UnifyPanel
        title='Create a project'
        description='Spin up a project tied to an existing client and optional budget.'
        actions={<ProjectsAddButton clients={clientOptions} />}
      >
        <p className='text-sm text-slate-400'>
          Launch the add project dialog to create new workstreams with budgets
          and status defaults.
        </p>
      </UnifyPanel>

      <UnifyPanel
        title='Project setup'
        description='Edit metadata, change ownership, or retire projects across the portfolio.'
      >
        <ProjectsTable projects={tableData} clients={clientOptions} />
      </UnifyPanel>
    </div>
  )
}
