'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/src/lib/utils'

type DialogContentProps = DialogPrimitive.DialogContentProps

type DialogOverlayProps = DialogPrimitive.DialogOverlayProps

type DialogPortalProps = DialogPrimitive.DialogPortalProps

type DialogTitleProps = DialogPrimitive.DialogTitleProps

type DialogDescriptionProps = DialogPrimitive.DialogDescriptionProps

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogPortal({ children, ...props }: DialogPortalProps) {
  return (
    <DialogPrimitive.Portal {...props}>
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        {children}
      </div>
    </DialogPrimitive.Portal>
  )
}

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
        className
      )}
      {...props}
    />
  )
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 w-[min(480px,calc(100vw-2rem))] rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/40 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className='absolute right-4 top-4 rounded-full border border-slate-700/60 bg-slate-900/70 p-1 text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'>
          <X className='h-4 w-4' aria-hidden />
          <span className='sr-only'>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mb-6 flex flex-col gap-2 text-left', className)}
    {...props}
  />
)

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-xl font-semibold text-white', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-slate-400', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName
