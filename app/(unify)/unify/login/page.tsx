import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/src/lib/auth/session'
import { LoginForm } from '@/src/components/unify/auth/login-form'

export default async function UnifyLoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/unify' as Route)
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100'>
      <div className='w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/40 backdrop-blur'>
        <div className='mb-8 space-y-2 text-center'>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
            Project UNIFY
          </p>
          <h1 className='font-headline text-3xl text-white'>
            Control Center Login
          </h1>
          <p className='text-sm text-slate-400'>
            Enter your credentials to access the internal dashboard.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
