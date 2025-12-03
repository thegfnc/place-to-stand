'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/src/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-none border-2 border-ink text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradientPrimary text-ink shadow-neo hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-neo-lg active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        secondary:
          'bg-white text-ink shadow-neo hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-neo-lg active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        ghost: 'bg-transparent border-transparent text-ink hover:bg-ink/5',
        outline:
          'bg-transparent text-ink shadow-neo hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-neo-lg active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-12 px-6',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
