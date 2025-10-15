'use client'

import { useEffect, useRef, useActionState } from 'react'
import { addHourBlock } from '@/app/(unify)/unify/actions/add-hour-block'
import type { ProjectsRow } from '@/src/lib/supabase/types'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface AddHourBlockFormProps {
  projects: Array<Pick<ProjectsRow, 'id' | 'name'>>
}

export function AddHourBlockForm({ projects }: AddHourBlockFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(addHourBlock, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='hourblock-project'>Project</Label>
        <select
          id='hourblock-project'
          name='projectId'
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue=''
        >
          <option value='' disabled>
            Select a project
          </option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
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
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='hourblock-date'>Effective Date</Label>
          <Input id='hourblock-date' name='effectiveDate' type='date' />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='hourblock-note'>Internal Note</Label>
        <Textarea
          id='hourblock-note'
          name='note'
          rows={2}
          placeholder='Purchase order, invoice number, or additional context.'
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
      <SubmitButton className='w-full'>Record hours</SubmitButton>
    </form>
  )
}
