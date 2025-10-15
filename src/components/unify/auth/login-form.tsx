'use client'

import { useActionState } from 'react'
import { signIn, type SignInState } from '@/app/(unify)/unify/login/actions'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'

const initialState: SignInState = {
  error: null,
}

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          name='email'
          id='email'
          type='email'
          placeholder='you@company.com'
          required
          autoComplete='email'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          name='password'
          id='password'
          type='password'
          required
          autoComplete='current-password'
        />
      </div>
      {state.error && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
          {state.error}
        </p>
      )}
      <SubmitButton className='w-full'>Sign in</SubmitButton>
    </form>
  )
}
