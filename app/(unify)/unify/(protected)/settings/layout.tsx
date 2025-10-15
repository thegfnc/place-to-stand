import type { ReactNode } from 'react'
import { requireProfile } from '@/src/lib/auth/session'
import { SettingsNav } from '@/src/components/unify/settings/settings-nav'

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireProfile(['admin'])

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='font-headline text-3xl text-white'>Admin settings</h1>
        <p className='text-sm text-slate-400'>
          Configure the operational backbone—clients, projects, retainers, and
          team access.
        </p>
      </div>
      <SettingsNav />
      <div className='space-y-6'>{children}</div>
    </div>
  )
}
