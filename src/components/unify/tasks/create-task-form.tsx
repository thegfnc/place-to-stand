'use client'

import { useEffect, useRef, useActionState } from 'react'
import { createTask } from '@/app/(unify)/unify/actions/create-task'
import { TASK_STATUSES } from '@/src/lib/unify/constants'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface CreateTaskFormProps {
  projects: Array<{ id: string; name: string; clientName?: string | null }>
  team: Array<{ id: string; label: string }>
}

export function CreateTaskForm({ projects, team }: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(createTask, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form
      ref={formRef}
      action={formAction}
      className='grid gap-4 md:grid-cols-2'
    >
      <div className='space-y-2 md:col-span-2'>
        <Label htmlFor='task-title'>Task Title</Label>
        <Input
          id='task-title'
          name='title'
          placeholder='Draft kickoff agenda'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='task-project'>Project</Label>
        <select
          id='task-project'
          name='projectId'
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
        >
          <option value='' disabled>
            Select project
          </option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
              {project.clientName ? ` · ${project.clientName}` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='task-status'>Status</Label>
        <select
          id='task-status'
          name='status'
          defaultValue='backlog'
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
        <Label htmlFor='task-assignee'>Assignee</Label>
        <select
          id='task-assignee'
          name='assigneeId'
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
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
        <Label htmlFor='task-reviewer'>Reviewer</Label>
        <select
          id='task-reviewer'
          name='reviewerId'
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
        >
          <option value=''>None</option>
          {team.map(member => (
            <option key={member.id} value={member.id}>
              {member.label}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='task-due'>Due Date</Label>
        <Input id='task-due' name='dueDate' type='date' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='task-start'>Doing Date</Label>
        <Input id='task-start' name='startDate' type='date' />
      </div>
      <div className='space-y-2 md:col-span-2'>
        <Label htmlFor='task-description'>Description</Label>
        <Textarea
          id='task-description'
          name='description'
          rows={4}
          placeholder='Add context, acceptance criteria, or links.'
        />
      </div>
      {state.status === 'error' && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200 md:col-span-2'>
          {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <p className='rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200 md:col-span-2'>
          {state.message}
        </p>
      )}
      <div className='md:col-span-2'>
        <SubmitButton className='w-full md:w-auto'>Create task</SubmitButton>
      </div>
    </form>
  )
}
