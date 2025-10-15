import Link from 'next/link'
import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import { format } from 'date-fns'
import {
  type ProfilesRow,
  type ProjectsRow,
  type TaskRow,
  type TimeEntryRow,
} from '@/src/lib/supabase/types'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { requireProfile } from '@/src/lib/auth/session'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { UnifyKanbanBoard } from '@/src/components/unify/tasks/unify-kanban-board'
import { TimeTrackingPanel } from '@/src/components/unify/time/time-tracking-panel'
import type { TaskStatusId } from '@/src/lib/unify/constants'

interface ProjectDetailParams {
  params: Promise<{
    clientId: string
    projectId: string
  }>
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailParams) {
  const profile = await requireProfile()

  if (profile.role === 'client') {
    redirect('/unify/login?reason=client-portal-not-ready' as Route)
  }

  const { clientId, projectId } = await params

  const supabase = await createSupabaseServerClient()

  const projectResponse = await supabase
    .from('projects')
    .select(
      `
        id,
        name,
        status,
        summary,
        budget_hours,
        client_id,
        client:clients ( id, name ),
        project_hour_blocks ( id, purchased_hours, effective_date, note, recorded_by )
      `
    )
    .eq('id', projectId)
    .maybeSingle()

  if (projectResponse.error) {
    throw new Error(projectResponse.error.message)
  }

  const project = projectResponse.data as
    | (Pick<
        ProjectsRow,
        'id' | 'name' | 'status' | 'summary' | 'budget_hours' | 'client_id'
      > & {
        client?: { id: string; name: string } | null
        project_hour_blocks?: Array<{
          id: string
          purchased_hours: number | null
          effective_date: string | null
          note: string | null
          recorded_by: string | null
        }>
      })
    | null

  if (!project || project.client_id !== clientId) {
    notFound()
  }

  const [tasksResponse, profilesResponse] = await Promise.all([
    supabase
      .from('tasks')
      .select(
        `
          id,
          title,
          description,
          status,
          project_id,
          assignee_id,
          reviewer_id,
          due_date,
          start_date,
          position,
          assignee:profiles!tasks_assignee_id_fkey ( id, full_name, email ),
          reviewer:profiles!tasks_reviewer_id_fkey ( id, full_name, email )
        `
      )
      .eq('project_id', projectId)
      .order('position', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('full_name'),
  ])

  if (tasksResponse.error) {
    throw new Error(tasksResponse.error.message)
  }

  if (profilesResponse.error) {
    throw new Error(profilesResponse.error.message)
  }

  const rawTasks = (tasksResponse.data ?? []) as Array<
    Pick<
      TaskRow,
      | 'id'
      | 'title'
      | 'description'
      | 'status'
      | 'project_id'
      | 'assignee_id'
      | 'reviewer_id'
      | 'due_date'
      | 'start_date'
      | 'position'
    > & {
      assignee?: {
        id: string
        full_name: string | null
        email: string | null
      } | null
      reviewer?: {
        id: string
        full_name: string | null
        email: string | null
      } | null
    }
  >

  const profiles = (profilesResponse.data ?? []) as Array<
    Pick<ProfilesRow, 'id' | 'full_name' | 'email' | 'role'>
  >

  const taskIds = rawTasks.map(task => task.id)

  const timeEntriesResponse =
    taskIds.length > 0
      ? await supabase
          .from('time_entries')
          .select('id, task_id, minutes, entry_date, person_id, created_at')
          .in('task_id', taskIds)
          .order('entry_date', { ascending: false })
      : { data: [] as TimeEntryRow[], error: null }

  if (timeEntriesResponse.error) {
    throw new Error(timeEntriesResponse.error.message)
  }

  const timeEntries = (timeEntriesResponse.data ?? []) as Array<
    Pick<
      TimeEntryRow,
      'id' | 'task_id' | 'minutes' | 'entry_date' | 'person_id' | 'created_at'
    >
  >

  const timeByTask = new Map<string, number>()

  timeEntries.forEach(entry => {
    const minutes = entry.minutes ?? 0
    timeByTask.set(
      entry.task_id,
      (timeByTask.get(entry.task_id) ?? 0) + minutes
    )
  })

  const projectPurchasedHours = (project.project_hour_blocks ?? []).reduce(
    (total, block) => total + Number(block.purchased_hours ?? 0),
    0
  )

  const projectLoggedMinutes = Array.from(timeByTask.values()).reduce(
    (sum, minutes) => sum + minutes,
    0
  )

  const internalProfiles = profiles.filter(member =>
    ['admin', 'worker'].includes(member.role)
  )

  const teamOptions = internalProfiles.map(member => ({
    id: member.id,
    label: member.full_name ?? member.email,
  }))

  const kanbanTasks = rawTasks.map(task => {
    const status = task.status as TaskStatusId
    const loggedMinutes = timeByTask.get(task.id) ?? 0

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status,
      assigneeId: task.assignee_id ?? null,
      assigneeLabel: task.assignee?.full_name ?? task.assignee?.email ?? null,
      reviewerId: task.reviewer_id ?? null,
      reviewerLabel: task.reviewer?.full_name ?? task.reviewer?.email ?? null,
      dueDate: task.due_date ?? null,
      startDate: task.start_date ?? null,
      projectId: task.project_id,
      projectLabel: project.name,
      clientLabel: project.client?.name ?? null,
      loggedMinutes,
      position: task.position ?? 0,
    }
  })

  const taskOptions = kanbanTasks.map(task => ({
    id: task.id,
    label: `${task.title}`,
  }))

  const profileById = new Map(profiles.map(member => [member.id, member]))

  const recentEntries = timeEntries.slice(0, 8).map(entry => ({
    id: entry.id,
    taskLabel:
      kanbanTasks.find(task => task.id === entry.task_id)?.title ??
      'Task entry',
    entryDate: entry.entry_date ?? entry.created_at,
    minutes: entry.minutes,
    personLabel:
      profileById.get(entry.person_id)?.full_name ??
      profileById.get(entry.person_id)?.email ??
      'Unknown',
  }))

  const projectSummary = {
    id: project.id,
    name: project.name,
    clientName: project.client?.name ?? null,
    purchasedHours: projectPurchasedHours,
    loggedHours: projectLoggedMinutes / 60,
  }

  const hourBlocks = (project.project_hour_blocks ?? [])
    .map(block => ({
      id: block.id,
      purchasedHours: Number(block.purchased_hours ?? 0),
      effectiveDate: block.effective_date,
      note: block.note,
    }))
    .sort((a, b) => {
      const aDate = a.effectiveDate ? new Date(a.effectiveDate).getTime() : 0
      const bDate = b.effectiveDate ? new Date(b.effectiveDate).getTime() : 0
      return bDate - aDate
    })

  const remainingHours = Math.max(
    projectSummary.purchasedHours - projectSummary.loggedHours,
    0
  )

  const projectHealth = [
    {
      label: 'Purchased hours',
      value: `${projectSummary.purchasedHours.toFixed(1)} h`,
    },
    {
      label: 'Logged hours',
      value: `${projectSummary.loggedHours.toFixed(1)} h`,
    },
    {
      label: 'Remaining balance',
      value: `${remainingHours.toFixed(1)} h`,
    },
    {
      label: 'Budget (optional)',
      value: project.budget_hours
        ? `${Number(project.budget_hours).toFixed(1)} h`
        : '—',
    },
  ]

  return (
    <div className='space-y-10'>
      <div className='space-y-3'>
        <Link
          href={`/unify/clients/${clientId}` as Route}
          className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 hover:text-slate-300'
        >
          ← Back to client
        </Link>
        <div>
          <h1 className='font-headline text-3xl text-white'>{project.name}</h1>
          {project.summary && (
            <p className='mt-2 max-w-3xl text-sm text-slate-400'>
              {project.summary}
            </p>
          )}
          <p className='mt-2 text-xs uppercase tracking-[0.3em] text-slate-500'>
            {project.status} · {project.client?.name ?? 'Unassigned client'}
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {projectHealth.map(item => (
          <div
            key={item.label}
            className='rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300'
          >
            <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
              {item.label}
            </p>
            <p className='mt-2 font-headline text-2xl text-white'>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <UnifyPanel
        title='Hour blocks'
        description='Retainer purchases logged against this project.'
        actions={
          profile.role === 'admin' ? (
            <Link
              href={'/unify/settings/hours' as Route}
              className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 underline-offset-4 hover:underline'
            >
              Manage hour blocks
            </Link>
          ) : null
        }
      >
        {hourBlocks.length === 0 ? (
          <p className='text-sm text-slate-400'>No hour blocks recorded yet.</p>
        ) : (
          <ul className='space-y-2 text-sm text-slate-200'>
            {hourBlocks.map(block => (
              <li
                key={block.id}
                className='flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between'
              >
                <span className='font-semibold'>
                  {block.purchasedHours.toFixed(1)} hours
                </span>
                <span className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                  {block.effectiveDate
                    ? format(new Date(block.effectiveDate), 'MMM d, yyyy')
                    : 'Date not provided'}
                </span>
                {block.note && (
                  <span className='text-xs text-slate-400'>{block.note}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </UnifyPanel>

      <UnifyKanbanBoard
        tasks={kanbanTasks}
        team={teamOptions}
        projects={[
          {
            id: project.id,
            name: project.name,
            clientName: project.client?.name,
          },
        ]}
      />

      <TimeTrackingPanel
        totalLoggedHours={projectSummary.loggedHours}
        projectSummaries={[projectSummary]}
        tasks={taskOptions}
        recentEntries={recentEntries}
      />
    </div>
  )
}
