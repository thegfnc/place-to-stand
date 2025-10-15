'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'

const links = [
  { label: 'Client registry', href: '/unify/settings/clients' },
  { label: 'Project setup', href: '/unify/settings/projects' },
  { label: 'Hour blocks', href: '/unify/settings/hours' },
  { label: 'Team access', href: '/unify/settings/team' },
] as const

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className='flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-2 text-xs uppercase tracking-[0.3em] text-slate-500'>
      {links.map(link => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href as Route}
            className={cn(
              'rounded-md px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
              isActive
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800 hover:text-slate-200'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
