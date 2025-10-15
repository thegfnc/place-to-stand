import Link from 'next/link'
import type { Route } from 'next'
import { redirect } from 'next/navigation'
import {
  type ClientsRow,
  type ProfilesRow,
  type ProjectsRow,
  type TaskRow,
  type TimeEntryRow,
} from '@/src/lib/supabase/types'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { requireProfile } from '@/src/lib/auth/session'
import { InsightCards } from '@/src/components/unify/overview/insight-cards'
import { UnifyPanel } from '@/src/components/unify/shared/panel'

interface ProjectSummary {
  id: string
  clientId: string
  name: string
  status: string
  summary?: string | null
  purchasedHours: number
  loggedHours: number
}

interface ClientSummary {
  id: string
  name: string
  status: string
  createdAt: string
  notes?: string | null
  projectCount: number
  purchasedHours: number
  loggedHours: number
}

export default async function ClientsIndexPage() {
  const profile = await requireProfile()

  if (profile.role === 'client') {
    redirect('/unify/login?reason=client-portal-not-ready' as Route)
  }

  const supabase = await createSupabaseServerClient()

  const [
    clientsResponse,
    projectsResponse,
    tasksResponse,
    timeEntriesResponse,
    teamResponse,
  ] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, status, notes, created_at')
      .order('name'),
    supabase
      .from('projects')
      .select(
        `
            id,
            name,
            status,
            summary,
            client_id,
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
    supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('full_name'),
  ])

  const responses = [
    clientsResponse,
    projectsResponse,
    tasksResponse,
    timeEntriesResponse,
    teamResponse,
  ] as const

  responses.forEach(response => {
    if (response.error) {
      throw new Error(response.error.message)
    }
  })

  const clients = (clientsResponse.data ?? []) as Array<
    Pick<ClientsRow, 'id' | 'name' | 'status' | 'notes' | 'created_at'>
  >

  const rawProjects = (projectsResponse.data ?? []) as Array<
    Pick<ProjectsRow, 'id' | 'name' | 'status' | 'summary' | 'client_id'> & {
      project_hour_blocks?: Array<{ purchased_hours: number | null }>
    }
  >

  const rawTasks = (tasksResponse.data ?? []) as Array<
    Pick<TaskRow, 'id' | 'project_id'>
  >

  const timeEntries = (timeEntriesResponse.data ?? []) as Array<
    Pick<TimeEntryRow, 'id' | 'task_id' | 'minutes'>
  >

  const profiles = (teamResponse.data ?? []) as Array<
    Pick<ProfilesRow, 'id' | 'full_name' | 'email' | 'role'>
  >

  const internalProfiles = profiles.filter(member =>
    ['admin', 'worker'].includes(member.role)
  )

  const taskProjectMap = new Map<string, string>()

  rawTasks.forEach(task => {
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

  const projects: ProjectSummary[] = rawProjects.map(project => {
    const purchasedHours = (project.project_hour_blocks ?? []).reduce(
      (total, block) => total + Number(block.purchased_hours ?? 0),
      0
    )

    const loggedMinutes = timeByProject.get(project.id) ?? 0

    return {
      id: project.id,
      clientId: project.client_id,
      name: project.name,
      status: project.status,
      summary: project.summary,
      purchasedHours,
      loggedHours: loggedMinutes / 60,
    }
  })

  const clientSummaries: ClientSummary[] = clients.map(client => {
    const clientProjects = projects.filter(
      project => project.clientId === client.id
    )

    const purchasedHours = clientProjects.reduce(
      (sum, project) => sum + project.purchasedHours,
      0
    )

    const loggedHours = clientProjects.reduce(
      (sum, project) => sum + project.loggedHours,
      0
    )

    return {
      id: client.id,
      name: client.name,
      status: client.status,
      notes: client.notes,
      createdAt: client.created_at,
      projectCount: clientProjects.length,
      purchasedHours,
      loggedHours,
    }
  })

  const totalClients = clients.length
  const activeProjects = projects.filter(
    project => project.status !== 'archived'
  ).length
  const totalPurchasedHours = projects.reduce(
    (sum, project) => sum + project.purchasedHours,
    0
  )
  const totalLoggedHours =
    timeEntries.reduce((sum, entry) => sum + (entry.minutes ?? 0), 0) / 60

  const remainingHours = Math.max(totalPurchasedHours - totalLoggedHours, 0)

  const metrics = [
    {
      id: 'clients',
      label: 'Active clients',
      value: String(totalClients),
      helper: 'Across all retainers',
    },
    {
      id: 'projects',
      label: 'Projects in flight',
      value: String(activeProjects),
      helper: 'With open deliverables',
    },
    {
      id: 'hours',
      label: 'Logged this cycle',
      value: `${totalLoggedHours.toFixed(1)} h`,
      helper:
        totalPurchasedHours > 0
          ? `${remainingHours.toFixed(1)} h remaining`
          : 'Track usage across all projects',
    },
    {
      id: 'team',
      label: 'Internal teammates',
      value: String(internalProfiles.length),
      helper: 'Admin + worker roles',
    },
  ]

  const sortedClients = clientSummaries.sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className='space-y-12'>
      <InsightCards metrics={metrics} />
      <UnifyPanel
        title='Clients directory'
        description='Pick a client to drill into related projects and delivery workstreams.'
        actions={
          profile.role === 'admin' ? (
            <Link
              href={'/unify/settings/clients' as Route}
              className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 underline-offset-4 hover:underline'
            >
              Manage in settings
            </Link>
          ) : null
        }
      >
        {sortedClients.length === 0 ? (
          <p className='text-sm text-slate-400'>
            No clients yet. Add one from settings.
          </p>
        ) : (
          <div className='grid gap-4 lg:grid-cols-2'>
            {sortedClients.map(client => {
              const utilization =
                client.purchasedHours > 0
                  ? Math.min(
                      Math.round(
                        (client.loggedHours / client.purchasedHours) * 100
                      ),
                      100
                    )
                  : 0

              return (
                <Link
                  key={client.id}
                  href={`/unify/clients/${client.id}` as Route}
                  className='flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/60'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='font-semibold text-white'>{client.name}</p>
                      <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                        {client.status}
                      </p>
                    </div>
                    <span className='text-xs text-slate-400'>
                      {client.projectCount} project
                      {client.projectCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className='space-y-2 text-xs text-slate-300'>
                    <p>
                      Logged {client.loggedHours.toFixed(1)} h · Purchased{' '}
                      {client.purchasedHours.toFixed(1)} h
                    </p>
                    <div className='h-2 rounded-full bg-slate-800'>
                      <div
                        className='h-2 rounded-full bg-emerald-500'
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                    <p className='text-[11px] text-slate-500'>
                      {utilization > 0
                        ? `${Math.max(100 - utilization, 0)}% retainer remaining`
                        : 'No logged hours yet'}
                    </p>
                  </div>
                  {client.notes && (
                    <p className='line-clamp-2 text-xs text-slate-400'>
                      {client.notes}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </UnifyPanel>
    </div>
  )
}
