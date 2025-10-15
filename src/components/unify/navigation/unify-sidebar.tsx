import Link from 'next/link'
import type { Route } from 'next'
import type { ProfilesRow, UserRole } from '@/src/lib/supabase/types'
import { cn } from '@/src/lib/utils'

interface UnifySidebarProps {
  profile: ProfilesRow
}

type NavItem = {
  label: string
  path: Route
  hash?: string
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/unify' as Route },
  {
    label: 'Admin Console',
    path: '/unify' as Route,
    hash: 'admin',
    roles: ['admin'],
  },
  {
    label: 'Kanban Board',
    path: '/unify' as Route,
    hash: 'board',
    roles: ['admin', 'worker'],
  },
  {
    label: 'Time Tracking',
    path: '/unify' as Route,
    hash: 'time',
    roles: ['admin', 'worker'],
  },
]

export function UnifySidebar({ profile }: UnifySidebarProps) {
  return (
    <aside className='hidden w-64 flex-col border-r border-slate-800 bg-slate-950/70 p-6 lg:flex'>
      <div className='mb-10 space-y-1'>
        <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
          Project UNIFY
        </p>
        <p className='font-headline text-2xl text-white'>Control Center</p>
      </div>
      <nav className='flex flex-1 flex-col gap-2 text-sm'>
        {navItems
          .filter(item =>
            item.roles ? item.roles.includes(profile.role) : true
          )
          .map(item => (
            <Link
              key={`${item.path}${item.hash ?? ''}`}
              href={
                item.hash ? { pathname: item.path, hash: item.hash } : item.path
              }
              className={cn(
                'rounded-md px-3 py-2 font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              )}
            >
              {item.label}
            </Link>
          ))}
      </nav>
      <div className='mt-10 space-y-2 text-xs text-slate-500'>
        <p className='font-semibold text-slate-200'>
          {profile.full_name ?? profile.email}
        </p>
        <p className='uppercase tracking-[0.2em]'>{profile.role}</p>
        <form action='/unify/logout' method='post'>
          <button
            type='submit'
            className='mt-3 inline-flex items-center rounded-md border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white'
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
