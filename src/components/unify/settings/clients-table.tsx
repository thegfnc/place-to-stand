'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteClient } from '@/app/(unify)/unify/actions/delete-client'
import { ClientForm } from '@/src/components/unify/admin/forms/create-client-form'
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
import { CLIENT_STATUSES } from '@/src/lib/unify/constants'
import { initialActionState } from '@/src/lib/unify/types'

interface ClientsTableProps {
  clients: Array<{
    id: string
    name: string
    status: string
    notes?: string | null
    projectCount: number
  }>
}

const statusMap = CLIENT_STATUSES.reduce<Record<string, string>>(
  (acc, status) => {
    acc[status.id] = status.label
    return acc
  },
  {}
)

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400'>
        No clients yet. Create one to get started.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40'>
      <div className='grid grid-cols-[2fr_1fr_2fr_auto] gap-4 border-b border-slate-800 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-500'>
        <span>Client</span>
        <span>Status</span>
        <span>Notes</span>
        <span className='text-right'>Actions</span>
      </div>
      <div className='divide-y divide-slate-800'>
        {clients.map(client => (
          <ClientsTableRow key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}

function ClientsTableRow({
  client,
}: {
  client: ClientsTableProps['clients'][number]
}) {
  const statusLabel = statusMap[client.status] ?? client.status

  return (
    <div className='grid grid-cols-[2fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'>
      <div className='space-y-2'>
        <p className='font-semibold text-white'>{client.name}</p>
        <p className='text-[11px] text-slate-500'>
          {client.projectCount} project{client.projectCount === 1 ? '' : 's'}
        </p>
      </div>
      <div className='text-xs uppercase tracking-[0.3em] text-slate-400'>
        {statusLabel}
      </div>
      <div className='text-sm text-slate-300'>
        {client.notes ? (
          <p className='whitespace-pre-wrap break-words'>{client.notes}</p>
        ) : (
          <span className='text-slate-600'>No notes</span>
        )}
      </div>
      <div className='flex items-start justify-end gap-2'>
        <EditClientDialog client={client} />
        <DeleteClientDialog client={client} />
      </div>
    </div>
  )
}

function EditClientDialog({
  client,
}: {
  client: ClientsTableProps['clients'][number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-md border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 hover:bg-slate-800'
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit client</DialogTitle>
          <DialogDescription>
            Update the client name, notes, or status. Changes apply across the
            workspace immediately.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          mode='edit'
          defaultValues={{
            id: client.id,
            name: client.name,
            status: client.status as (typeof CLIENT_STATUSES)[number]['id'],
            notes: client.notes ?? '',
          }}
          onSuccess={() => setOpen(false)}
          submitLabel='Save changes'
        />
      </DialogContent>
    </Dialog>
  )
}

function DeleteClientDialog({
  client,
}: {
  client: ClientsTableProps['clients'][number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-md border-red-500/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-300 hover:border-red-400 hover:text-red-200'
        >
          Delete
        </Button>
      </DialogTrigger>
      {open ? (
        <DeleteClientDialogContent
          client={client}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog>
  )
}

function DeleteClientDialogContent({
  client,
  onClose,
}: {
  client: ClientsTableProps['clients'][number]
  onClose: () => void
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteClient, initialActionState)

  useEffect(() => {
    if (state.status === 'success') {
      onClose()
      router.refresh()
    }
  }, [state.status, onClose, router])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete client</DialogTitle>
        <DialogDescription>
          This will remove {client.name} and all related data. This action
          cannot be undone.
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
          <input type='hidden' name='clientId' value={client.id} />
          <SubmitButton className='rounded-md border border-red-500/40 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-red-500'>
            Delete
          </SubmitButton>
        </form>
      </DialogFooter>
    </DialogContent>
  )
}

export function ClientsAddButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='rounded-md px-4 py-2 text-xs uppercase tracking-[0.3em]'
        >
          Add client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add client</DialogTitle>
          <DialogDescription>
            Capture a new client record including internal notes and current
            status.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSuccess={() => setOpen(false)}
          submitLabel='Create client'
        />
      </DialogContent>
    </Dialog>
  )
}
