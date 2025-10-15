'use client'

import { useEffect, useMemo, useRef, useActionState } from 'react'
import { createProject } from '@/app/(unify)/unify/actions/create-project'
import { updateProject } from '@/app/(unify)/unify/actions/update-project'
import type { ClientsRow } from '@/src/lib/supabase/types'
import { PROJECT_STATUSES } from '@/src/lib/unify/constants'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface ProjectFormProps {
  clients: Array<Pick<ClientsRow, 'id' | 'name'> & { status?: string }>
  mode?: 'create' | 'edit'
  defaultValues?: {
    id?: string
    clientId?: string
    name?: string
    status?: (typeof PROJECT_STATUSES)[number]['id']
    summary?: string | null
    code?: string | null
    budgetHours?: number | null
  }
  onSuccess?: () => void
  submitLabel?: string
}

export function ProjectForm({
  clients,
  mode = 'create',
  defaultValues,
  onSuccess,
  submitLabel,
}: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const action = mode === 'create' ? createProject : updateProject
  const [state, formAction] = useActionState(action, initialActionState)

  const statusOptions = useMemo(() => PROJECT_STATUSES, [])
  const initialStatus =
    defaultValues?.status ?? statusOptions[0]?.id ?? 'active'

  useEffect(() => {
    if (state.status === 'success') {
      if (mode === 'create') {
        formRef.current?.reset()
      }
      onSuccess?.()
    }
  }, [state.status, mode, onSuccess])

  if (mode === 'edit' && !defaultValues?.id) {
    throw new Error('ProjectForm in edit mode requires an id in defaultValues')
  }

  return (
    <form
      key={defaultValues?.id ?? 'project-form'}
      ref={formRef}
      action={formAction}
      className='space-y-4'
    >
      {mode === 'edit' && defaultValues?.id ? (
        <input type='hidden' name='projectId' value={defaultValues.id} />
      ) : null}
      <div className='space-y-2'>
        <Label htmlFor='project-client'>Client</Label>
        <select
          id='project-client'
          name='clientId'
          required
          defaultValue={defaultValues?.clientId ?? ''}
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
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
          defaultValue={defaultValues?.name ?? ''}
          required
        />
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='project-code'>Project Code</Label>
          <Input
            id='project-code'
            name='code'
            placeholder='ACME-WEB'
            defaultValue={defaultValues?.code ?? ''}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='project-budget'>Budgeted Hours</Label>
          <Input
            id='project-budget'
            name='budgetHours'
            inputMode='decimal'
            placeholder='120'
            defaultValue={
              defaultValues?.budgetHours !== undefined &&
              defaultValues?.budgetHours !== null
                ? defaultValues.budgetHours.toString()
                : ''
            }
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='project-status'>Status</Label>
        <select
          id='project-status'
          name='status'
          defaultValue={initialStatus}
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
        >
          {statusOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='project-summary'>Summary</Label>
        <Textarea
          id='project-summary'
          name='summary'
          placeholder='High-level mission, deliverables, or kickoff notes.'
          rows={3}
          defaultValue={defaultValues?.summary ?? ''}
        />
      </div>
      {state.status === 'error' && state.message && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {state.message}
        </p>
      )}
      {state.status === 'success' && state.message && mode === 'create' && (
        <p className='rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200'>
          {state.message}
        </p>
      )}
      <SubmitButton className='w-full'>
        {submitLabel ?? (mode === 'create' ? 'Create project' : 'Save changes')}
      </SubmitButton>
    </form>
  )
}

export function CreateProjectForm(props: Omit<ProjectFormProps, 'mode'>) {
  return <ProjectForm mode='create' {...props} />
}
