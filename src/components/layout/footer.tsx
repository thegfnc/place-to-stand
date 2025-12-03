import Link from 'next/link'
import { NAV_LINKS, hashHref } from '@/src/components/layout/nav-links'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className='border-t-2 border-ink bg-ink text-ink-light'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 md:flex-row md:items-start md:justify-between'>
        <div className='flex flex-col gap-3'>
          <span className='font-logo text-lg font-semibold uppercase tracking-[0.025em]'>
            Place To Stand
          </span>
          <p className='max-w-md text-sm text-ink-light/70'>
            Your lever in the digital world. As a strategic, design, and
            development partner, we build the tools and foundations that help
            businesses move the world.
          </p>
        </div>
        <nav className='flex flex-col gap-3'>
          <span className='text-left text-sm font-semibold uppercase tracking-[0.1em]'>
            Explore
          </span>
          <div className='flex flex-col gap-2 text-left'>
            {NAV_LINKS.map(link => (
              <Link
                key={link.hash}
                href={hashHref(link.hash)}
                className='text-xs font-semibold tracking-[0.1em] text-ink-light/70 transition hover:text-white'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-12 md:flex-row md:items-start md:justify-between'>
        <div className='flex flex-col gap-2 text-xs uppercase tracking-[0.1em] text-ink-light/60 md:flex-row md:items-center md:gap-3'>
          <span className='order-last md:order-first'>
            © {year} Place To Stand. All rights reserved.
          </span>
          <Link
            className='text-ink-light/60 transition hover:text-white'
            href='/privacy'
          >
            Privacy Policy
          </Link>
          <Link
            className='text-ink-light/60 transition hover:text-white'
            href='/terms'
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
