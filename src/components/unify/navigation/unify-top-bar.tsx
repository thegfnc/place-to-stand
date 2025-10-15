import type { ProfilesRow } from '@/src/lib/supabase/types'
import { cn } from '@/src/lib/utils'

interface UnifyTopBarProps {
  profile: ProfilesRow
}

export function UnifyTopBar({ profile }: UnifyTopBarProps) {
  const quickActions = [] as Array<{ label: string; href: string }>

  if (profile.role === 'admin') {
    quickActions.push(
      { label: 'New Client', href: '#admin' },
      { label: 'New Project', href: '#admin-projects' },
      { label: 'Invite User', href: '#admin-users' }
    )
  }

  if (profile.role === 'worker' || profile.role === 'admin') {
    quickActions.push(
      { label: 'Create Task', href: '#board' },
      { label: 'Log Time', href: '#time' }
    )
  }

  return (
    <header className='flex flex-col gap-4 border-b border-slate-800 bg-slate-950/60 px-6 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between'>
      <div>
        <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
          Project UNIFY
        </p>
        <h1 className='font-headline text-2xl text-white'>
          Welcome back, {profile.full_name ?? profile.email}
        </h1>
      </div>
      <div className='flex flex-col items-start gap-3 lg:flex-row lg:items-center'>
        <span
          className={cn(
            'inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300',
            profile.role === 'client' && 'bg-sky-500/10 text-sky-300'
          )}
        >
          {profile.role}
        </span>
        {quickActions.length > 0 && (
          <nav className='flex flex-wrap items-center gap-2 text-xs text-slate-300'>
            {quickActions.map(action => (
              <a
                key={action.label}
                href={action.href}
                className='rounded-md border border-slate-700 px-3 py-1 transition hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              >
                {action.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
