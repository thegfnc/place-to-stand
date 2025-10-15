'use client'

import { SubmitButton } from '@/src/components/unify/shared/submit-button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { updateHourBlock } from '@/app/(unify)/unify/actions/update-hour-block'
import { deleteHourBlock } from '@/app/(unify)/unify/actions/delete-hour-block'

interface HourBlocksTableProps {
  hourBlocks: Array<{
    id: string
    projectId: string
    clientId: string
    projectName: string
    clientName?: string | null
    purchasedHours: number
    effectiveDate: string | null
    note?: string | null
  }>
}

export function HourBlocksTable({ hourBlocks }: HourBlocksTableProps) {
  if (hourBlocks.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400'>
        No hour blocks recorded yet.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40'>
      <div className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 border-b border-slate-800 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-500'>
        <span>Project</span>
        <span>Purchased</span>
        <span>Effective date</span>
        <span>Note</span>
        <span className='text-right'>Actions</span>
      </div>
      <div className='divide-y divide-slate-800'>
        {hourBlocks.map(block => (
          <form
            key={block.id}
            action={updateHourBlock}
            className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'
          >
            <input type='hidden' name='hourBlockId' value={block.id} />
            <input type='hidden' name='projectId' value={block.projectId} />
            <input type='hidden' name='clientId' value={block.clientId} />
            <div className='space-y-1 text-xs text-slate-400'>
              <p className='text-sm font-semibold text-white'>
                {block.projectName}
              </p>
              <p className='uppercase tracking-[0.3em]'>
                {block.clientName ?? 'Internal'}
              </p>
            </div>
            <div>
              <Input
                name='purchasedHours'
                type='number'
                step='0.1'
                min='0'
                defaultValue={block.purchasedHours.toString()}
                required
              />
            </div>
            <div>
              <Input
                name='effectiveDate'
                type='date'
                defaultValue={block.effectiveDate ?? ''}
              />
            </div>
            <div>
              <Textarea
                name='note'
                defaultValue={block.note ?? ''}
                rows={2}
                className='text-sm'
              />
            </div>
            <div className='flex items-start justify-end gap-2'>
              <SubmitButton className='rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800'>
                Save
              </SubmitButton>
              <button
                type='submit'
                formAction={deleteHourBlock}
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
