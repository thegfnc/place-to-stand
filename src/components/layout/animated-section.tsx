'use client'

import { useEffect, useRef, useState } from 'react'
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
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (visible) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.13,
        rootMargin: '0px 0px -5% 0px',
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setVisible(true)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <section
      id={id}
      ref={node => {
        ref.current = node
      }}
      className={cn(
        'mx-auto w-full max-w-6xl px-6 py-32 opacity-0 transition-all duration-700 ease-out will-change-transform',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
