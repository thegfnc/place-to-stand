'use client'

import { useEffect, useRef, useActionState } from 'react'
import { inviteUser } from '@/app/(unify)/unify/actions/invite-user'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

export function InviteUserForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(inviteUser, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='invite-name'>Full Name</Label>
        <Input
          id='invite-name'
          name='fullName'
          placeholder='Alex Johnson'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='invite-email'>Email</Label>
        <Input
          id='invite-email'
          name='email'
          type='email'
          placeholder='alex@company.com'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='invite-role'>Role</Label>
        <select
          id='invite-role'
          name='role'
          required
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          defaultValue='worker'
        >
          <option value='admin'>Internal Admin</option>
          <option value='worker'>Internal Worker</option>
          <option value='client'>Client</option>
        </select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='invite-password'>Temporary Password</Label>
        <Input
          id='invite-password'
          name='password'
          type='password'
          placeholder='Generate a secure temporary password'
          required
        />
        <p className='text-[11px] text-slate-500'>
          Share this password with the invitee securely. They can change it
          after login.
        </p>
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
      <SubmitButton className='w-full'>Send invite</SubmitButton>
    </form>
  )
}
