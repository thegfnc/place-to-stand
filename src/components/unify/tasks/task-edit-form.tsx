'use client'

import { useEffect, useState, useTransition, useActionState } from 'react'
import { updateTask } from '@/app/(unify)/unify/actions/update-task'
import { deleteTask } from '@/app/(unify)/unify/actions/delete-task'
import { TASK_STATUSES } from '@/src/lib/unify/constants'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface TaskEditFormProps {
  task: {
    id: string
    title: string
    description?: string | null
    status: string
    assigneeId?: string | null
    reviewerId?: string | null
    dueDate?: string | null
    startDate?: string | null
    projectId: string
  }
  projects: Array<{ id: string; name: string; clientName?: string | null }>
  team: Array<{ id: string; label: string }>
  onClose?: () => void
}

export function TaskEditForm({
  task,
  projects,
  team,
  onClose,
}: TaskEditFormProps) {
  const [state, formAction] = useActionState(updateTask, initialActionState)
  const [isDeleting, startDeleting] = useTransition()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (state.status === 'success') {
      onClose?.()
    }
  }, [state.status, onClose])

  return (
    <form action={formAction} className='space-y-4'>
      <input type='hidden' name='taskId' value={task.id} />
      <div className='space-y-2'>
        <Label htmlFor='edit-task-title'>Title</Label>
        <Input
          id='edit-task-title'
          name='title'
          defaultValue={task.title}
          required
        />
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-status'>Status</Label>
          <select
            id='edit-task-status'
            name='status'
            defaultValue={task.status}
            className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          >
            {TASK_STATUSES.map(status => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-project'>Project</Label>
          <select
            id='edit-task-project'
            name='projectId'
            defaultValue={task.projectId}
            disabled
            className='w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-400'
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <p className='text-[11px] text-slate-500'>
            Project cannot be changed yet.
          </p>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-assignee'>Assignee</Label>
          <select
            id='edit-task-assignee'
            name='assigneeId'
            defaultValue={task.assigneeId ?? ''}
            className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          >
            <option value=''>Unassigned</option>
            {team.map(member => (
              <option key={member.id} value={member.id}>
                {member.label}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-reviewer'>Reviewer</Label>
          <select
            id='edit-task-reviewer'
            name='reviewerId'
            defaultValue={task.reviewerId ?? ''}
            className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          >
            <option value=''>None</option>
            {team.map(member => (
              <option key={member.id} value={member.id}>
                {member.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-start'>Doing Date</Label>
          <Input
            id='edit-task-start'
            name='startDate'
            type='date'
            defaultValue={task.startDate ?? ''}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='edit-task-due'>Due Date</Label>
          <Input
            id='edit-task-due'
            name='dueDate'
            type='date'
            defaultValue={task.dueDate ?? ''}
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='edit-task-description'>Description</Label>
        <Textarea
          id='edit-task-description'
          name='description'
          rows={4}
          defaultValue={task.description ?? ''}
        />
      </div>
      {state.status === 'error' && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {state.message}
        </p>
      )}
      {deleteError && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {deleteError}
        </p>
      )}
      <div className='flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between'>
        <SubmitButton className='sm:w-auto'>Save changes</SubmitButton>
        <button
          type='button'
          onClick={() => {
            setDeleteError(null)
            startDeleting(async () => {
              try {
                await deleteTask({ taskId: task.id })
                onClose?.()
              } catch (error) {
                console.error('Failed to delete task', error)
                setDeleteError(
                  error instanceof Error
                    ? error.message
                    : 'Unable to delete task'
                )
              }
            })
          }}
          disabled={isDeleting}
          className='text-xs font-semibold uppercase tracking-[0.2em] text-red-300 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
        >
          {isDeleting ? 'Deleting…' : 'Delete task'}
        </button>
      </div>
    </form>
  )
}
