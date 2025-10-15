import type { ProfilesRow } from '@/src/lib/supabase/types'

interface UnifyTopBarProps {
  profile: ProfilesRow
}

export function UnifyTopBar({ profile }: UnifyTopBarProps) {
  return (
    <header className='flex flex-col gap-4 border-b border-slate-800 bg-slate-950/60 px-6 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between'>
      <div>
        <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
          Project UNIFY
        </p>
        <h1 className='font-headline text-2xl text-white'>
          Welcome back, {profile.full_name ?? profile.email}
        </h1>
        <p className='mt-1 text-sm text-slate-400'>
          Choose a client to drill into projects, or open settings for
          administrative tools.
        </p>
      </div>
      <span className='inline-flex items-center self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 lg:self-center'>
        {profile.role}
      </span>
    </header>
  )
}
