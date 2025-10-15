'use client'

import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Input } from '@/src/components/ui/input'
import { updateProfile } from '@/app/(unify)/unify/actions/update-profile'
import { deleteUser } from '@/app/(unify)/unify/actions/delete-user'

interface TeamMember {
  id: string
  fullName: string | null
  email: string
  role: string
}

interface TeamTableProps {
  members: TeamMember[]
  currentProfileId: string
}

const ROLE_OPTIONS = [
  { id: 'admin', label: 'Admin' },
  { id: 'worker', label: 'Worker' },
  { id: 'client', label: 'Client' },
] as const

export function TeamTable({ members, currentProfileId }: TeamTableProps) {
  if (members.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400'>
        No internal users yet. Invite your first teammate above.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40'>
      <div className='grid grid-cols-[2fr_2fr_1fr_auto] gap-4 border-b border-slate-800 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-500'>
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span className='text-right'>Actions</span>
      </div>
      <div className='divide-y divide-slate-800'>
        {members.map(member => {
          const isSelf = member.id === currentProfileId

          return (
            <form
              key={member.id}
              action={updateProfile}
              className='grid grid-cols-[2fr_2fr_1fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'
            >
              <input type='hidden' name='profileId' value={member.id} />
              <div>
                <Input
                  name='fullName'
                  defaultValue={member.fullName ?? ''}
                  placeholder='Full name'
                />
              </div>
              <div className='flex items-center text-xs text-slate-400'>
                {member.email}
              </div>
              <div>
                <select
                  name='role'
                  defaultValue={member.role}
                  className='w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
                  disabled={isSelf}
                >
                  {ROLE_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isSelf && (
                  <p className='mt-2 text-[11px] text-slate-500'>
                    Admins cannot change their own role.
                  </p>
                )}
              </div>
              <div className='flex items-start justify-end gap-2'>
                <SubmitButton
                  className='rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800'
                  disabled={isSelf}
                >
                  Save
                </SubmitButton>
                <button
                  type='submit'
                  formAction={deleteUser}
                  disabled={isSelf}
                  className='rounded-md border border-red-500/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Delete
                </button>
              </div>
            </form>
          )
        })}
      </div>
    </div>
  )
}
