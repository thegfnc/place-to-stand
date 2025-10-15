import type { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface UnifyPanelProps {
  id?: string
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function UnifyPanel({
  id,
  title,
  description,
  children,
  actions,
  className,
}: UnifyPanelProps) {
  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 backdrop-blur',
        className
      )}
    >
      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='font-headline text-xl text-white'>{title}</h2>
          {description && (
            <p className='text-sm text-slate-400'>{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className='space-y-4 text-sm text-slate-100'>{children}</div>
    </section>
  )
}
