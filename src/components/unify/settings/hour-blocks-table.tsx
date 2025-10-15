'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteHourBlock } from '@/app/(unify)/unify/actions/delete-hour-block'
import { HourBlockForm } from '@/src/components/unify/admin/forms/add-hour-block-form'
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
import type { ProjectsRow } from '@/src/lib/supabase/types'
import { initialActionState } from '@/src/lib/unify/types'

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
  projects: Array<
    Pick<ProjectsRow, 'id' | 'name' | 'client_id'> & {
      client_name?: string | null
    }
  >
}

export function HourBlocksTable({
  hourBlocks,
  projects,
}: HourBlocksTableProps) {
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
          <HourBlockRow key={block.id} hourBlock={block} projects={projects} />
        ))}
      </div>
    </div>
  )
}

function HourBlockRow({
  hourBlock,
  projects,
}: {
  hourBlock: HourBlocksTableProps['hourBlocks'][number]
  projects: HourBlocksTableProps['projects']
}) {
  return (
    <div className='grid grid-cols-[2fr_1fr_1fr_2fr_auto] gap-4 px-4 py-4 text-sm text-slate-200'>
      <div className='space-y-1 text-xs text-slate-400'>
        <p className='text-sm font-semibold text-white'>
          {hourBlock.projectName}
        </p>
        <p className='uppercase tracking-[0.3em]'>
          {hourBlock.clientName ?? 'Internal'}
        </p>
      </div>
      <div className='text-sm text-slate-100'>
        {hourBlock.purchasedHours.toFixed(1)} h
      </div>
      <div className='text-sm text-slate-300'>
        {hourBlock.effectiveDate ? hourBlock.effectiveDate : '—'}
      </div>
      <div className='text-sm text-slate-300'>
        {hourBlock.note ? (
          <p className='whitespace-pre-wrap break-words'>{hourBlock.note}</p>
        ) : (
          <span className='text-slate-600'>No note</span>
        )}
      </div>
      <div className='flex items-start justify-end gap-2'>
        <EditHourBlockDialog hourBlock={hourBlock} projects={projects} />
        <DeleteHourBlockDialog hourBlock={hourBlock} />
      </div>
    </div>
  )
}

function EditHourBlockDialog({
  hourBlock,
  projects,
}: {
  hourBlock: HourBlocksTableProps['hourBlocks'][number]
  projects: HourBlocksTableProps['projects']
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
          <DialogTitle>Edit hour block</DialogTitle>
          <DialogDescription>
            Adjust purchased hours, effective date, or internal notes for this
            block.
          </DialogDescription>
        </DialogHeader>
        <HourBlockForm
          mode='edit'
          projects={projects}
          defaultValues={{
            id: hourBlock.id,
            projectId: hourBlock.projectId,
            clientId: hourBlock.clientId,
            purchasedHours: hourBlock.purchasedHours,
            effectiveDate: hourBlock.effectiveDate,
            note: hourBlock.note ?? '',
          }}
          onSuccess={() => setOpen(false)}
          submitLabel='Save changes'
        />
      </DialogContent>
    </Dialog>
  )
}

function DeleteHourBlockDialog({
  hourBlock,
}: {
  hourBlock: HourBlocksTableProps['hourBlocks'][number]
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
        <DeleteHourBlockDialogContent
          hourBlock={hourBlock}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog>
  )
}

function DeleteHourBlockDialogContent({
  hourBlock,
  onClose,
}: {
  hourBlock: HourBlocksTableProps['hourBlocks'][number]
  onClose: () => void
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(
    deleteHourBlock,
    initialActionState
  )

  useEffect(() => {
    if (state.status === 'success') {
      onClose()
      router.refresh()
    }
  }, [state.status, onClose, router])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete hour block</DialogTitle>
        <DialogDescription>
          Removing this block will delete the purchased hours record. This
          action cannot be undone.
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
          <input type='hidden' name='hourBlockId' value={hourBlock.id} />
          <input type='hidden' name='projectId' value={hourBlock.projectId} />
          <input type='hidden' name='clientId' value={hourBlock.clientId} />
          <SubmitButton className='rounded-md border border-red-500/40 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-red-500'>
            Delete
          </SubmitButton>
        </form>
      </DialogFooter>
    </DialogContent>
  )
}

export function HourBlocksAddButton({
  projects,
}: {
  projects: HourBlocksTableProps['projects']
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='rounded-md px-4 py-2 text-xs uppercase tracking-[0.3em]'
        >
          Add hours
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record purchased hours</DialogTitle>
          <DialogDescription>
            Log new retainers or adjustments against a client project.
          </DialogDescription>
        </DialogHeader>
        <HourBlockForm
          projects={projects}
          onSuccess={() => setOpen(false)}
          submitLabel='Record hours'
        />
      </DialogContent>
    </Dialog>
  )
}
