import type { ReactNode } from 'react'
import { requireProfile } from '@/src/lib/auth/session'
import { UnifySidebar } from '@/src/components/unify/navigation/unify-sidebar'
import { UnifyTopBar } from '@/src/components/unify/navigation/unify-top-bar'

export default async function ProtectedUnifyLayout({
  children,
}: {
  children: ReactNode
}) {
  const profile = await requireProfile()

  return (
    <div className='flex min-h-screen bg-slate-950 text-slate-100'>
      <UnifySidebar profile={profile} />
      <div className='flex min-h-screen flex-1 flex-col'>
        <UnifyTopBar profile={profile} />
        <main className='flex-1 overflow-y-auto bg-slate-900 px-6 py-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
