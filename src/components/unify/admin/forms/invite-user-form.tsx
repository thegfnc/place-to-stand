'use client'

import { useEffect, useRef, useActionState } from 'react'
import { inviteUser } from '@/app/(unify)/unify/actions/invite-user'
import { updateProfile } from '@/app/(unify)/unify/actions/update-profile'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { initialActionState } from '@/src/lib/unify/types'

interface InviteUserFormProps {
  mode?: 'create' | 'edit'
  defaultValues?: {
    id?: string
    fullName?: string | null
    email?: string
    role?: 'admin' | 'worker' | 'client'
  }
  onSuccess?: () => void
  submitLabel?: string
}

export function InviteUserForm({
  mode = 'create',
  defaultValues,
  onSuccess,
  submitLabel,
}: InviteUserFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const action = mode === 'create' ? inviteUser : updateProfile
  const [state, formAction] = useActionState(action, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      if (mode === 'create') {
        formRef.current?.reset()
      }
      onSuccess?.()
    }
  }, [state.status, mode, onSuccess])

  if (mode === 'edit' && !defaultValues?.id) {
    throw new Error(
      'InviteUserForm in edit mode requires an id in defaultValues'
    )
  }

  return (
    <form
      key={defaultValues?.id ?? 'invite-user-form'}
      ref={formRef}
      action={formAction}
      className='space-y-4'
    >
      {mode === 'edit' && defaultValues?.id ? (
        <input type='hidden' name='profileId' value={defaultValues.id} />
      ) : null}
      <div className='space-y-2'>
        <Label htmlFor='invite-name'>Full Name</Label>
        <Input
          id='invite-name'
          name='fullName'
          placeholder='Alex Johnson'
          defaultValue={defaultValues?.fullName ?? ''}
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
          defaultValue={defaultValues?.email ?? ''}
          required={mode === 'create'}
          disabled={mode === 'edit'}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='invite-role'>Role</Label>
        <select
          id='invite-role'
          name='role'
          required
          defaultValue={defaultValues?.role ?? 'worker'}
          className='w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
        >
          <option value='admin'>Internal Admin</option>
          <option value='worker'>Internal Worker</option>
          <option value='client'>Client</option>
        </select>
      </div>
      {mode === 'create' && (
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
      )}
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
        {submitLabel ?? (mode === 'create' ? 'Send invite' : 'Save changes')}
      </SubmitButton>
    </form>
  )
}
