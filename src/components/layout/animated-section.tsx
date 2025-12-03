'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/src/lib/utils'

interface AnimatedSectionProps extends ComponentProps<'section'> {
  id?: string
}

export function AnimatedSection({
  className,
  children,
  id,
  ...props
}: AnimatedSectionProps) {
  return (
    <section
      id={id}
      className={cn('mx-auto w-full max-w-6xl px-6 py-32', className)}
      {...props}
    >
      {children}
    </section>
  )
}
