import Link from 'next/link'
import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  type ClientsRow,
  type ProjectsRow,
  type TaskRow,
  type TimeEntryRow,
} from '@/src/lib/supabase/types'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { requireProfile } from '@/src/lib/auth/session'
import { InsightCards } from '@/src/components/unify/overview/insight-cards'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import type { TaskStatusId } from '@/src/lib/unify/constants'

interface ClientProjectsParams {
  params: {
    clientId: string
  }
}

interface ProjectSummary {
  id: string
  name: string
  status: string
  summary?: string | null
  purchasedHours: number
  loggedHours: number
  openTasks: number
  completedTasks: number
}

export default async function ClientDetailPage({
  params,
}: ClientProjectsParams) {
  const profile = await requireProfile()

  if (profile.role === 'client') {
    redirect('/unify/login?reason=client-portal-not-ready' as Route)
  }

  const { clientId } = params

  const supabase = await createSupabaseServerClient()

  const clientResponse = await supabase
    .from('clients')
    .select('id, name, status, notes, created_at')
    .eq('id', clientId)
    .maybeSingle()

  if (clientResponse.error) {
    throw new Error(clientResponse.error.message)
  }

  const client = clientResponse.data as Pick<
    ClientsRow,
    'id' | 'name' | 'status' | 'notes' | 'created_at'
  > | null

  if (!client) {
    notFound()
  }

  const projectsResponse = await supabase
    .from('projects')
    .select(
      `
        id,
        name,
        status,
        summary,
        budget_hours,
        project_hour_blocks ( id, purchased_hours )
      `
    )
    .eq('client_id', clientId)
    .order('name')

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message)
  }

  const rawProjects = (projectsResponse.data ?? []) as Array<
    Pick<ProjectsRow, 'id' | 'name' | 'status' | 'summary' | 'budget_hours'> & {
      project_hour_blocks?: Array<{
        id: string
        purchased_hours: number | null
      }>
    }
  >

  const projectIds = rawProjects.map(project => project.id)

  const tasksResponse =
    projectIds.length > 0
      ? await supabase
          .from('tasks')
          .select('id, title, status, project_id')
          .in('project_id', projectIds)
      : { data: [] as TaskRow[], error: null }

  if (tasksResponse.error) {
    throw new Error(tasksResponse.error.message)
  }

  const rawTasks = (tasksResponse.data ?? []) as Array<
    Pick<TaskRow, 'id' | 'title' | 'status' | 'project_id'>
  >

  const taskIds = rawTasks.map(task => task.id)

  const timeEntriesResponse =
    taskIds.length > 0
      ? await supabase
          .from('time_entries')
          .select('id, task_id, minutes, entry_date')
          .in('task_id', taskIds)
          .order('entry_date', { ascending: false })
      : { data: [] as TimeEntryRow[], error: null }

  if (timeEntriesResponse.error) {
    throw new Error(timeEntriesResponse.error.message)
  }

  const timeEntries = (timeEntriesResponse.data ?? []) as Array<
    Pick<TimeEntryRow, 'id' | 'task_id' | 'minutes'>
  >

  const taskProjectMap = new Map<string, string>()

  rawTasks.forEach(task => {
    if (task.project_id) {
      taskProjectMap.set(task.id, task.project_id)
    }
  })

  const tasksByProject = new Map<
    string,
    Array<{
      id: string
      status: TaskStatusId
    }>
  >()

  rawTasks.forEach(task => {
    const status = task.status as TaskStatusId
    const existing = tasksByProject.get(task.project_id) ?? []
    existing.push({ id: task.id, status })
    tasksByProject.set(task.project_id, existing)
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

    const projectTasks = tasksByProject.get(project.id) ?? []
    const openTasks = projectTasks.filter(task => task.status !== 'done').length
    const completedTasks = projectTasks.filter(
      task => task.status === 'done'
    ).length

    const loggedMinutes = timeByProject.get(project.id) ?? 0

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      summary: project.summary,
      purchasedHours,
      loggedHours: loggedMinutes / 60,
      openTasks,
      completedTasks,
    }
  })

  const totalProjects = projects.length
  const totalOpenTasks = projects.reduce(
    (sum, project) => sum + project.openTasks,
    0
  )
  const totalCompletedTasks = projects.reduce(
    (sum, project) => sum + project.completedTasks,
    0
  )
  const totalPurchasedHours = projects.reduce(
    (sum, project) => sum + project.purchasedHours,
    0
  )
  const totalLoggedHours = projects.reduce(
    (sum, project) => sum + project.loggedHours,
    0
  )

  const clientMetrics = [
    {
      id: 'projects',
      label: 'Projects',
      value: String(totalProjects),
      helper: 'Active + archived',
    },
    {
      id: 'openTasks',
      label: 'Open tasks',
      value: String(totalOpenTasks),
      helper: `${totalCompletedTasks} completed`,
    },
    {
      id: 'loggedHours',
      label: 'Logged hours',
      value: `${totalLoggedHours.toFixed(1)} h`,
      helper:
        totalPurchasedHours > 0
          ? `${Math.max(totalPurchasedHours - totalLoggedHours, 0).toFixed(1)} h remaining`
          : 'No purchased hours recorded',
    },
    {
      id: 'status',
      label: 'Client status',
      value: client.status,
      helper: 'Managed via settings',
    },
  ]

  const sortedProjects = projects.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className='space-y-10'>
      <div className='space-y-3'>
        <Link
          href={'/unify/clients' as Route}
          className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 hover:text-slate-300'
        >
          ← Back to clients
        </Link>
        <div>
          <h1 className='font-headline text-3xl text-white'>{client.name}</h1>
          {client.notes && (
            <p className='mt-2 max-w-3xl text-sm text-slate-400'>
              {client.notes}
            </p>
          )}
        </div>
      </div>

      <InsightCards metrics={clientMetrics} />

      <UnifyPanel
        title='Projects'
        description='Select a project to manage tasks, workflows, and time tracking.'
        actions={
          profile.role === 'admin' ? (
            <Link
              href={'/unify/settings/projects' as Route}
              className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 underline-offset-4 hover:underline'
            >
              Manage in settings
            </Link>
          ) : null
        }
      >
        {sortedProjects.length === 0 ? (
          <p className='text-sm text-slate-400'>
            No projects yet. Spin one up from settings.
          </p>
        ) : (
          <div className='grid gap-4 xl:grid-cols-2'>
            {sortedProjects.map(project => {
              const utilization =
                project.purchasedHours > 0
                  ? Math.min(
                      Math.round(
                        (project.loggedHours / project.purchasedHours) * 100
                      ),
                      100
                    )
                  : 0

              return (
                <Link
                  key={project.id}
                  href={
                    `/unify/clients/${client.id}/projects/${project.id}` as Route
                  }
                  className='flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/60'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='font-semibold text-white'>{project.name}</p>
                      <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                        {project.status}
                      </p>
                    </div>
                    <span className='text-xs text-slate-400'>
                      {project.openTasks} open · {project.completedTasks} done
                    </span>
                  </div>
                  {project.summary && (
                    <p className='line-clamp-2 text-xs text-slate-400'>
                      {project.summary}
                    </p>
                  )}
                  <div className='space-y-2 text-xs text-slate-300'>
                    <p>
                      Logged {project.loggedHours.toFixed(1)} h · Purchased{' '}
                      {project.purchasedHours.toFixed(1)} h
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
                </Link>
              )
            })}
          </div>
        )}
      </UnifyPanel>
    </div>
  )
}
