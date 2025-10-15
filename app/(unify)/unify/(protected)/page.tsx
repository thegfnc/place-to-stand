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
import { UnifyAdminConsole } from '@/src/components/unify/admin/unify-admin-console'
import { UnifyKanbanBoard } from '@/src/components/unify/tasks/unify-kanban-board'
import { TimeTrackingPanel } from '@/src/components/unify/time/time-tracking-panel'
import type { TaskStatusId } from '@/src/lib/unify/constants'

interface ProjectWithRelations extends ProjectsRow {
  client?: Pick<ClientsRow, 'id' | 'name'> | null
  project_hour_blocks?: Array<{
    id: string
    purchased_hours: number | null
  }>
}

interface TaskWithRelations extends TaskRow {
  assignee?: Pick<ProfilesRow, 'id' | 'full_name' | 'email'> | null
  reviewer?: Pick<ProfilesRow, 'id' | 'full_name' | 'email'> | null
  project?:
    | (Pick<ProjectWithRelations, 'id' | 'name' | 'client_id'> & {
        client?: Pick<ClientsRow, 'id' | 'name'> | null
      })
    | null
}

export default async function UnifyHomePage() {
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
      .select('id, name, status, created_at')
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
            budget_hours,
            created_at,
            client:clients ( id, name ),
            project_hour_blocks ( id, purchased_hours )
          `
      )
      .order('name'),
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
            created_at,
            assignee:profiles!tasks_assignee_id_fkey ( id, full_name, email ),
            reviewer:profiles!tasks_reviewer_id_fkey ( id, full_name, email ),
            project:projects ( id, name, client:clients ( id, name ) )
          `
      )
      .order('position', { ascending: false }),
    supabase
      .from('time_entries')
      .select('id, task_id, minutes, entry_date, person_id, created_at')
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
    Pick<ClientsRow, 'id' | 'name' | 'status' | 'created_at'>
  >

  const rawProjects = (projectsResponse.data ?? []) as ProjectWithRelations[]
  const rawTasks = (tasksResponse.data ?? []) as TaskWithRelations[]
  const timeEntries = (timeEntriesResponse.data ?? []) as TimeEntryRow[]
  const profiles = (teamResponse.data ?? []) as Array<
    Pick<ProfilesRow, 'id' | 'full_name' | 'email' | 'role'>
  >

  const internalProfiles = profiles.filter(member =>
    ['admin', 'worker'].includes(member.role)
  )

  const profileById = new Map(profiles.map(item => [item.id, item]))

  const taskProjectMap = new Map<string, string>()

  rawTasks.forEach(task => {
    if (task.project_id) {
      taskProjectMap.set(task.id, task.project_id)
    }
  })

  const timeByTask = new Map<string, number>()
  const timeByProject = new Map<string, number>()

  timeEntries.forEach(entry => {
    const minutes = entry.minutes ?? 0
    timeByTask.set(
      entry.task_id,
      (timeByTask.get(entry.task_id) ?? 0) + minutes
    )
    const projectId = taskProjectMap.get(entry.task_id)
    if (projectId) {
      timeByProject.set(
        projectId,
        (timeByProject.get(projectId) ?? 0) + minutes
      )
    }
  })

  const projects = rawProjects.map(project => {
    const purchasedHours = (project.project_hour_blocks ?? []).reduce(
      (total, block) => {
        return total + Number(block.purchased_hours ?? 0)
      },
      0
    )

    const loggedMinutes = timeByProject.get(project.id) ?? 0

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      summary: project.summary,
      client_id: project.client_id,
      budget_hours: project.budget_hours,
      clientName: project.client?.name ?? 'Unassigned',
      purchasedHours,
      loggedHours: loggedMinutes / 60,
    }
  })

  const tasks = rawTasks.map(task => {
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
      projectLabel: task.project?.name ?? 'Unassigned project',
      clientLabel: task.project?.client?.name ?? null,
      loggedMinutes,
      position: task.position ?? 0,
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
    timeEntries.reduce((sum, entry) => sum + entry.minutes, 0) / 60

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

  const projectOptions = projects.map(project => ({
    id: project.id,
    name: project.name,
    clientName: project.clientName,
  }))

  const teamOptions = internalProfiles.map(member => ({
    id: member.id,
    label: member.full_name ?? member.email,
  }))

  const taskOptions = tasks.map(task => ({
    id: task.id,
    label: `${task.projectLabel} · ${task.title}`,
  }))

  const recentEntries = timeEntries.slice(0, 8).map(entry => ({
    id: entry.id,
    taskLabel:
      tasks.find(task => task.id === entry.task_id)?.title ?? 'Task entry',
    entryDate: entry.entry_date ?? entry.created_at,
    minutes: entry.minutes,
    personLabel:
      profileById.get(entry.person_id)?.full_name ??
      profileById.get(entry.person_id)?.email ??
      'Unknown',
  }))

  return (
    <div className='space-y-12'>
      <InsightCards metrics={metrics} />

      {profile.role === 'admin' && (
        <section id='admin' className='space-y-6'>
          <h2 className='font-headline text-2xl text-white'>
            Admin command center
          </h2>
          <UnifyAdminConsole
            clients={clients}
            projects={projects}
            internalUsers={internalProfiles}
          />
        </section>
      )}

      <UnifyKanbanBoard
        tasks={tasks}
        team={teamOptions}
        projects={projectOptions}
      />

      <TimeTrackingPanel
        totalLoggedHours={totalLoggedHours}
        projectSummaries={projects}
        tasks={taskOptions}
        recentEntries={recentEntries}
      />
    </div>
  )
}
