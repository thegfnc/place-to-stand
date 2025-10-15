'use client'

import { CLIENT_STATUSES } from '@/src/lib/unify/constants'
import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { updateClient } from '@/app/(unify)/unify/actions/update-client'
import { deleteClient } from '@/app/(unify)/unify/actions/delete-client'

interface ClientsTableProps {
  clients: Array<{
    id: string
    name: string
    status: string
    notes?: string | null
    projectCount: number
  }>
}

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
          <form
            key={client.id}
            action={updateClient}
            className='grid grid-cols-[2fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'
          >
            <input type='hidden' name='clientId' value={client.id} />
            <div className='space-y-2'>
              <Input name='name' defaultValue={client.name} required />
              <p className='text-[11px] text-slate-500'>
                {client.projectCount} project
                {client.projectCount === 1 ? '' : 's'}
              </p>
            </div>
            <div>
              <select
                name='status'
                defaultValue={client.status}
                className='w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
              >
                {CLIENT_STATUSES.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Textarea
                name='notes'
                defaultValue={client.notes ?? ''}
                rows={2}
                className='min-h-[60px] text-sm'
              />
            </div>
            <div className='flex items-start justify-end gap-2'>
              <SubmitButton className='rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800'>
                Save
              </SubmitButton>
              <button
                type='submit'
                formAction={deleteClient}
                className='rounded-md border border-red-500/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-300 transition hover:border-red-400 hover:text-red-200'
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
