'use client'

import { useEffect, useMemo, useRef, useState, useActionState } from 'react'
import { addHourBlock } from '@/app/(unify)/unify/actions/add-hour-block'
import { updateHourBlock } from '@/app/(unify)/unify/actions/update-hour-block'
import type { ProjectsRow } from '@/src/lib/supabase/types'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface ProjectOption extends Pick<ProjectsRow, 'id' | 'name' | 'client_id'> {
  client_name?: string | null
}

type HourBlockFormMode = 'create' | 'edit'

interface HourBlockFormValues {
  id?: string
  projectId?: string
  clientId?: string
  purchasedHours?: number
  effectiveDate?: string | null
  note?: string | null
}

interface HourBlockFormProps {
  projects: Array<ProjectOption>
  mode?: HourBlockFormMode
  defaultValues?: HourBlockFormValues
  onSuccess?: () => void
  submitLabel?: string
}

export function HourBlockForm({
  projects,
  mode = 'create',
  defaultValues,
  onSuccess,
  submitLabel,
}: HourBlockFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const action = mode === 'create' ? addHourBlock : updateHourBlock
  const [state, formAction] = useActionState(action, initialActionState)

  const projectMap = useMemo(() => {
    return projects.reduce<Record<string, { clientId: string; label: string }>>(
      (acc, project) => {
        acc[project.id] = {
          clientId: project.client_id,
          label: project.client_name
            ? `${project.name} · ${project.client_name}`
            : project.name,
        }
        return acc
      },
      {}
    )
  }, [projects])

  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultValues?.projectId ?? ''
  )

  useEffect(() => {
    setSelectedProjectId(defaultValues?.projectId ?? '')
  }, [defaultValues?.projectId])

  useEffect(() => {
    if (state.status === 'success') {
      if (mode === 'create') {
        formRef.current?.reset()
        setSelectedProjectId('')
      }
      onSuccess?.()
    }
  }, [state.status, mode, onSuccess])

  if (mode === 'edit' && !defaultValues?.id) {
    throw new Error(
      'HourBlockForm in edit mode requires an id in defaultValues'
    )
  }

  const resolvedClientId =
    projectMap[selectedProjectId]?.clientId ?? defaultValues?.clientId ?? ''

  return (
    <form
      key={defaultValues?.id ?? 'hour-block-form'}
      ref={formRef}
      action={formAction}
      className='space-y-4'
    >
      {mode === 'edit' && defaultValues?.id ? (
        <input type='hidden' name='hourBlockId' value={defaultValues.id} />
      ) : null}
      {resolvedClientId && (
        <input type='hidden' name='clientId' value={resolvedClientId} />
      )}
      <div className='space-y-2'>
        <Label htmlFor='hourblock-project'>Project</Label>
        <select
          id='hourblock-project'
          name='projectId'
          value={selectedProjectId}
          onChange={event => setSelectedProjectId(event.target.value)}
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
        >
          <option value='' disabled>
            Select a project
          </option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {projectMap[project.id]?.label ?? project.name}
            </option>
          ))}
        </select>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='hourblock-hours'>Purchased Hours</Label>
          <Input
            id='hourblock-hours'
            name='purchasedHours'
            inputMode='decimal'
            placeholder='40'
            required
            defaultValue={
              defaultValues?.purchasedHours !== undefined
                ? defaultValues.purchasedHours.toString()
                : ''
            }
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='hourblock-date'>Effective Date</Label>
          <Input
            id='hourblock-date'
            name='effectiveDate'
            type='date'
            defaultValue={defaultValues?.effectiveDate ?? ''}
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='hourblock-note'>Internal Note</Label>
        <Textarea
          id='hourblock-note'
          name='note'
          rows={2}
          placeholder='Purchase order, invoice number, or additional context.'
          defaultValue={defaultValues?.note ?? ''}
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
        {submitLabel ?? (mode === 'create' ? 'Record hours' : 'Save changes')}
      </SubmitButton>
    </form>
  )
}

export function AddHourBlockForm(props: Omit<HourBlockFormProps, 'mode'>) {
  return <HourBlockForm mode='create' {...props} />
}
