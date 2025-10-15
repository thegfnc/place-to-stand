import type {
  ClientsRow,
  ProfilesRow,
  ProjectsRow,
} from '@/src/lib/supabase/types'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { CreateClientForm } from '@/src/components/unify/admin/forms/create-client-form'
import { CreateProjectForm } from '@/src/components/unify/admin/forms/create-project-form'
import { InviteUserForm } from '@/src/components/unify/admin/forms/invite-user-form'
import { AddHourBlockForm } from '@/src/components/unify/admin/forms/add-hour-block-form'
import { format } from 'date-fns'

interface AdminConsoleProps {
  clients: Array<Pick<ClientsRow, 'id' | 'name' | 'status' | 'created_at'>>
  projects: Array<
    Pick<ProjectsRow, 'id' | 'name' | 'status' | 'budget_hours'> & {
      clientName: string
      purchasedHours: number
      loggedHours: number
    }
  >
  internalUsers: Array<Pick<ProfilesRow, 'id' | 'full_name' | 'email' | 'role'>>
}

export function UnifyAdminConsole({
  clients,
  projects,
  internalUsers,
}: AdminConsoleProps) {
  const latestClients = [...clients]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  return (
    <div className='grid gap-6 xl:grid-cols-2'>
      <UnifyPanel
        title='Client Registry'
        description='Create new client records and maintain partner visibility.'
      >
        <CreateClientForm />
        {latestClients.length > 0 ? (
          <div className='pt-4 text-xs text-slate-400'>
            <p className='mb-2 font-semibold uppercase tracking-[0.2em] text-slate-500'>
              Recent clients
            </p>
            <ul className='space-y-1'>
              {latestClients.map(client => (
                <li
                  key={client.id}
                  className='flex items-center justify-between'
                >
                  <span className='text-slate-200'>{client.name}</span>
                  <span>
                    {format(new Date(client.created_at), 'MMM d, yyyy')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className='text-xs text-slate-500'>
            No clients yet. Be the first to add one.
          </p>
        )}
      </UnifyPanel>

      <UnifyPanel
        title='Project Setup'
        description='Spin up new projects and align them with client budgets.'
      >
        <CreateProjectForm clients={clients} />
        {projects.length > 0 && (
          <div className='pt-4 text-xs text-slate-400'>
            <p className='mb-2 font-semibold uppercase tracking-[0.2em] text-slate-500'>
              Active projects
            </p>
            <ul className='space-y-1'>
              {projects.slice(0, 5).map(project => (
                <li
                  key={project.id}
                  className='flex items-center justify-between'
                >
                  <span className='text-slate-200'>
                    {project.name}
                    <span className='text-slate-500'>
                      {' '}
                      · {project.clientName}
                    </span>
                  </span>
                  <span>
                    {project.loggedHours.toFixed(1)} /{' '}
                    {project.purchasedHours > 0
                      ? project.purchasedHours.toFixed(1)
                      : (project.budget_hours ?? 0)}{' '}
                    h
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </UnifyPanel>

      <UnifyPanel
        id='admin-projects'
        title='Record Purchased Hours'
        description='Track retainers and hour blocks for each project.'
      >
        <AddHourBlockForm
          projects={projects.map(({ id, name }) => ({ id, name }))}
        />
      </UnifyPanel>

      <UnifyPanel
        id='admin-users'
        title='Invite Team Members'
        description='Provision internal teammates or client stakeholders.'
      >
        <InviteUserForm />
        {internalUsers.length > 0 && (
          <div className='pt-4 text-xs text-slate-400'>
            <p className='mb-2 font-semibold uppercase tracking-[0.2em] text-slate-500'>
              Current internal roster
            </p>
            <ul className='space-y-1'>
              {internalUsers.map(user => (
                <li key={user.id} className='flex items-center justify-between'>
                  <span className='text-slate-200'>
                    {user.full_name ?? user.email}
                  </span>
                  <span className='uppercase tracking-[0.2em]'>
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </UnifyPanel>
    </div>
  )
}
