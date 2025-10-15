'use client'

import type { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/src/components/ui/button'

export function SubmitButton({
  children,
  disabled,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' disabled={pending || disabled} {...props}>
      {pending ? 'Working…' : children}
    </Button>
  )
}
