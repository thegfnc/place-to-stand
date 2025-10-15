'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProject } from '@/app/(unify)/unify/actions/delete-project'
import { ProjectForm } from '@/src/components/unify/admin/forms/create-project-form'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { PROJECT_STATUSES } from '@/src/lib/unify/constants'
import { initialActionState } from '@/src/lib/unify/types'

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

const projectStatusMap = PROJECT_STATUSES.reduce<Record<string, string>>(
  (acc, status) => {
    acc[status.id] = status.label
    return acc
  },
  {}
)

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
          <ProjectRow key={project.id} project={project} clients={clients} />
        ))}
      </div>
    </div>
  )
}

function ProjectRow({
  project,
  clients,
}: {
  project: ProjectsTableProps['projects'][number]
  clients: ProjectsTableProps['clients']
}) {
  return (
    <div className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'>
      <div className='space-y-2'>
        <p className='font-semibold text-white'>{project.name}</p>
        <div className='grid grid-cols-2 gap-2 text-[11px] text-slate-500'>
          <span>Logged {project.loggedHours.toFixed(1)} h</span>
          <span>Purchased {project.purchasedHours.toFixed(1)} h</span>
        </div>
        <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
          {project.code ?? 'No internal code'}
        </p>
      </div>
      <div className='text-sm text-slate-300'>{project.clientName}</div>
      <div className='text-xs uppercase tracking-[0.3em] text-slate-400'>
        {projectStatusMap[project.status] ?? project.status}
      </div>
      <div className='text-sm text-slate-300'>
        {project.summary ? (
          <p className='whitespace-pre-wrap break-words'>{project.summary}</p>
        ) : (
          <span className='text-slate-600'>No summary</span>
        )}
      </div>
      <div className='flex items-start justify-end gap-2'>
        <EditProjectDialog project={project} clients={clients} />
        <DeleteProjectDialog project={project} />
      </div>
    </div>
  )
}

function EditProjectDialog({
  project,
  clients,
}: {
  project: ProjectsTableProps['projects'][number]
  clients: ProjectsTableProps['clients']
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-md border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 hover:bg-slate-800'
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Update project metadata, status, or budget details.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          mode='edit'
          clients={clients}
          defaultValues={{
            id: project.id,
            clientId: project.clientId,
            name: project.name,
            status: project.status as (typeof PROJECT_STATUSES)[number]['id'],
            summary: project.summary ?? '',
            code: project.code ?? '',
            budgetHours: project.budgetHours,
          }}
          onSuccess={() => setOpen(false)}
          submitLabel='Save changes'
        />
      </DialogContent>
    </Dialog>
  )
}

function DeleteProjectDialog({
  project,
}: {
  project: ProjectsTableProps['projects'][number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-md border-red-500/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-300 hover:border-red-400 hover:text-red-200'
        >
          Delete
        </Button>
      </DialogTrigger>
      {open ? (
        <DeleteProjectDialogContent
          project={project}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog>
  )
}

function DeleteProjectDialogContent({
  project,
  onClose,
}: {
  project: ProjectsTableProps['projects'][number]
  onClose: () => void
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteProject, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      onClose()
      router.refresh()
    }
  }, [state.status, onClose, router])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete project</DialogTitle>
        <DialogDescription>
          This permanently removes the project and its related tracking data.
          Continue with caution.
        </DialogDescription>
      </DialogHeader>
      {state.status === 'error' && state.message ? (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {state.message}
        </p>
      ) : null}
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-slate-300 hover:text-white'
          >
            Cancel
          </Button>
        </DialogClose>
        <form
          action={formAction}
          className='flex flex-col gap-3 sm:flex-row sm:items-center'
        >
          <input type='hidden' name='projectId' value={project.id} />
          <input type='hidden' name='clientId' value={project.clientId} />
          <SubmitButton className='rounded-md border border-red-500/40 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-red-500'>
            Delete
          </SubmitButton>
        </form>
      </DialogFooter>
    </DialogContent>
  )
}

export function ProjectsAddButton({
  clients,
}: {
  clients: ProjectsTableProps['clients']
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='rounded-md px-4 py-2 text-xs uppercase tracking-[0.3em]'
        >
          Add project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Spin up a new project tied to an existing client and optional
            budget.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          clients={clients}
          onSuccess={() => setOpen(false)}
          submitLabel='Create project'
        />
      </DialogContent>
    </Dialog>
  )
}
