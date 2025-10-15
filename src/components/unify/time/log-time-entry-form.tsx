'use client'

import { useEffect, useRef, useActionState } from 'react'
import { logTimeEntry } from '@/app/(unify)/unify/actions/log-time-entry'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface TaskOption {
  id: string
  label: string
}

interface LogTimeEntryFormProps {
  tasks: TaskOption[]
}

export function LogTimeEntryForm({ tasks }: LogTimeEntryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(logTimeEntry, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='time-task'>Task</Label>
        <select
          id='time-task'
          name='taskId'
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
        >
          <option value='' disabled>
            Select a task
          </option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.label}
            </option>
          ))}
        </select>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='time-hours'>Hours</Label>
          <Input
            id='time-hours'
            name='hours'
            inputMode='decimal'
            placeholder='1.5'
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='time-date'>Date</Label>
          <Input id='time-date' name='entryDate' type='date' />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='time-notes'>Notes</Label>
        <Textarea
          id='time-notes'
          name='notes'
          rows={3}
          placeholder='What did you work on? Optional context for billing.'
        />
      </div>
      {state.status === 'error' && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <p className='rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200'>
          {state.message}
        </p>
      )}
      <SubmitButton className='w-full sm:w-auto'>Log time</SubmitButton>
    </form>
  )
}
