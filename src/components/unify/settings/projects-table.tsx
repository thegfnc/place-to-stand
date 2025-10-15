'use client'

import { PROJECT_STATUSES } from '@/src/lib/unify/constants'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { updateProject } from '@/app/(unify)/unify/actions/update-project'
import { deleteProject } from '@/app/(unify)/unify/actions/delete-project'

interface ProjectsTableProps {
  projects: Array<{
    id: string
    name: string
    status: string
    summary?: string | null
    code?: string | null
    budgetHours: number | null
    clientId: string
    clientName: string
    purchasedHours: number
    loggedHours: number
  }>
  clients: Array<{ id: string; name: string }>
}

export function ProjectsTable({ projects, clients }: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400'>
        No projects yet. Create one to begin tracking delivery.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40'>
      <div className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 border-b border-slate-800 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-500'>
        <span>Project</span>
        <span>Client</span>
        <span>Status</span>
        <span>Summary</span>
        <span className='text-right'>Actions</span>
      </div>
      <div className='divide-y divide-slate-800'>
        {projects.map(project => (
          <form
            key={project.id}
            action={updateProject}
            className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'
          >
            <input type='hidden' name='projectId' value={project.id} />
            <div className='space-y-2'>
              <Input name='name' defaultValue={project.name} required />
              <div className='grid grid-cols-2 gap-2 text-[11px] text-slate-500'>
                <span>Logged {project.loggedHours.toFixed(1)} h</span>
                <span>Purchased {project.purchasedHours.toFixed(1)} h</span>
              </div>
              <Input
                name='code'
                placeholder='Internal code'
                defaultValue={project.code ?? ''}
              />
            </div>
            <div className='space-y-2'>
              <select
                name='clientId'
                defaultValue={project.clientId}
                className='w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <Input
                name='budgetHours'
                type='number'
                step='0.1'
                placeholder='Budget hours'
                defaultValue={
                  project.budgetHours !== null
                    ? project.budgetHours.toString()
                    : ''
                }
              />
            </div>
            <div>
              <select
                name='status'
                defaultValue={project.status}
                className='w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              >
                {PROJECT_STATUSES.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Textarea
                name='summary'
                defaultValue={project.summary ?? ''}
                rows={3}
                className='text-sm'
              />
            </div>
            <div className='flex items-start justify-end gap-2'>
              <SubmitButton className='rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800'>
                Save
              </SubmitButton>
              <button
                type='submit'
                formAction={deleteProject}
                className='rounded-md border border-red-500/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-300 transition hover:border-red-400 hover:text-red-200'
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
