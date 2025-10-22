'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

const NAV_LINKS = [
  { hash: 'services', label: 'Services' },
  { hash: 'work', label: 'Work' },
  { hash: 'how-we-work', label: 'How We Work' },
  { hash: 'team', label: 'Team' },
  { hash: 'faq', label: 'FAQ' },
  { hash: 'contact', label: 'Contact' },
]

const hashHref = (hash: string) => ({ pathname: '/', hash })

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 100)
    }

    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500',
        scrolled ? 'py-3' : 'py-6'
      )}
    >
      <div
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-full border py-3 pl-7 pr-4 backdrop-blur-lg transition duration-500 hover:bg-white/90',
          scrolled
            ? 'border-ink/10 bg-white/70 shadow-md'
            : 'border-ink/10 bg-white/20'
        )}
      >
        <Link href={hashHref('home')} className='flex items-center gap-3'>
          <span className='font-logo text-2xl font-semibold uppercase tracking-[0.025em] text-ink'>
            Place To Stand
          </span>
        </Link>
        <nav className='hidden items-center gap-5 md:flex'>
          {NAV_LINKS.map(item => (
            <Link
              key={item.hash}
              href={hashHref(item.hash)}
              className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/70 transition hover:text-ink'
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-3'>
          <Button
            asChild
            size='sm'
            variant='secondary'
            className='hidden px-11 md:inline-flex'
          >
            <Link href={hashHref('contact')}>Start a Project</Link>
          </Button>
          <button
            type='button'
            className='md:hidden'
            onClick={() => setMobileOpen(open => !open)}
            aria-controls='mobile-nav'
            aria-expanded={mobileOpen}
          >
            <span className='sr-only'>Toggle navigation</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              className='h-8 w-8 text-ink'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 7h16M4 12h16M4 17h16'
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={cn(
          'absolute top-full w-full max-w-6xl px-4 transition duration-300 md:hidden',
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        )}
      >
        <nav
          id='mobile-nav'
          className={cn(
            'flex w-full max-w-6xl flex-col gap-2 rounded-[28px] border border-ink/10 bg-white p-6 text-center shadow-xl transition md:hidden'
          )}
        >
          {NAV_LINKS.map(item => (
            <Link
              key={item.hash}
              href={hashHref(item.hash)}
              className='rounded-full px-6 py-3 text-base font-semibold uppercase tracking-[0.2em] text-ink/80 transition'
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
