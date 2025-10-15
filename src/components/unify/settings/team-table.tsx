'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUser } from '@/app/(unify)/unify/actions/delete-user'
import { InviteUserForm } from '@/src/components/unify/admin/forms/invite-user-form'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { initialActionState } from '@/src/lib/unify/types'

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

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  worker: 'Worker',
  client: 'Client',
}

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
        {members.map(member => (
          <TeamRow
            key={member.id}
            member={member}
            isSelf={member.id === currentProfileId}
          />
        ))}
      </div>
    </div>
  )
}

function TeamRow({ member, isSelf }: { member: TeamMember; isSelf: boolean }) {
  return (
    <div className='grid grid-cols-[2fr_2fr_1fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'>
      <div>
        <p className='font-semibold text-white'>
          {member.fullName ?? 'No name'}
        </p>
        {member.fullName ? (
          <p className='text-xs text-slate-500'>Account owner</p>
        ) : (
          <p className='text-xs text-slate-500'>Name not set</p>
        )}
      </div>
      <div className='flex items-center text-xs text-slate-400'>
        {member.email}
      </div>
      <div className='text-xs uppercase tracking-[0.3em] text-slate-400'>
        {ROLE_LABELS[member.role] ?? member.role}
      </div>
      <div className='flex items-start justify-end gap-2'>
        <EditTeamMemberDialog member={member} disabled={isSelf} />
        <DeleteTeamMemberDialog member={member} disabled={isSelf} />
      </div>
    </div>
  )
}

function EditTeamMemberDialog({
  member,
  disabled,
}: {
  member: TeamMember
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled}
          className='rounded-md border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit team member</DialogTitle>
          <DialogDescription>
            Update the teammate&apos;s display name or role. Role changes take
            effect immediately.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm
          mode='edit'
          defaultValues={{
            id: member.id,
            fullName: member.fullName ?? '',
            email: member.email,
            role: member.role as 'admin' | 'worker' | 'client',
          }}
          onSuccess={() => setOpen(false)}
          submitLabel='Save changes'
        />
      </DialogContent>
    </Dialog>
  )
}

function DeleteTeamMemberDialog({
  member,
  disabled,
}: {
  member: TeamMember
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled}
          className='rounded-md border-red-500/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-300 hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Delete
        </Button>
      </DialogTrigger>
      {open ? (
        <DeleteTeamMemberDialogContent
          member={member}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog>
  )
}

function DeleteTeamMemberDialogContent({
  member,
  onClose,
}: {
  member: TeamMember
  onClose: () => void
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteUser, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      onClose()
      router.refresh()
    }
  }, [state.status, onClose, router])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove team member</DialogTitle>
        <DialogDescription>
          This will revoke {member.email}&apos;s access to the workspace. The
          action cannot be reversed.
        </DialogDescription>
      </DialogHeader>
      {state.status === 'error' && state.message ? (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {state.message}
        </p>
      ) : null}
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-slate-300 hover:text-white'
          >
            Cancel
          </Button>
        </DialogClose>
        <form
          action={formAction}
          className='flex flex-col gap-3 sm:flex-row sm:items-center'
        >
          <input type='hidden' name='profileId' value={member.id} />
          <SubmitButton className='rounded-md border border-red-500/40 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-red-500'>
            Delete
          </SubmitButton>
        </form>
      </DialogFooter>
    </DialogContent>
  )
}

export function TeamAddButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='rounded-md px-4 py-2 text-xs uppercase tracking-[0.3em]'
        >
          Invite teammate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            Provision access for internal staff, contractors, or clients.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm
          onSuccess={() => setOpen(false)}
          submitLabel='Send invite'
        />
      </DialogContent>
    </Dialog>
  )
}
