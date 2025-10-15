'use client'

import { useEffect, useRef, useActionState } from 'react'
import { createClient } from '@/app/(unify)/unify/actions/create-client'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

export function CreateClientForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(createClient, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='client-name'>Client Name</Label>
        <Input id='client-name' name='name' placeholder='Acme Corp' required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='client-notes'>Notes</Label>
        <Textarea
          id='client-notes'
          name='notes'
          placeholder='Internal context or billing details'
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
      <SubmitButton className='w-full'>Create client</SubmitButton>
    </form>
  )
}
