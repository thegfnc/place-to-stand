'use client'

import { useEffect, useRef, useActionState } from 'react'
import { createProject } from '@/app/(unify)/unify/actions/create-project'
import type { ClientsRow } from '@/src/lib/supabase/types'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface CreateProjectFormProps {
  clients: Array<Pick<ClientsRow, 'id' | 'name'>>
}

export function CreateProjectForm({ clients }: CreateProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(createProject, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='project-client'>Client</Label>
        <select
          id='project-client'
          name='clientId'
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
        >
          <option value='' disabled>
            Select a client
          </option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='project-name'>Project Name</Label>
        <Input
          id='project-name'
          name='name'
          placeholder='Website Redesign'
          required
        />
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='project-code'>Project Code</Label>
          <Input id='project-code' name='code' placeholder='ACME-WEB' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='project-budget'>Budgeted Hours</Label>
          <Input
            id='project-budget'
            name='budgetHours'
            inputMode='decimal'
            placeholder='120'
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='project-summary'>Summary</Label>
        <Textarea
          id='project-summary'
          name='summary'
          placeholder='High-level mission, deliverables, or kickoff notes.'
          rows={3}
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
      <SubmitButton className='w-full'>Create project</SubmitButton>
    </form>
  )
}
