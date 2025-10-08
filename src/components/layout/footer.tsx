import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className='bg-ink text-ink-light'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-3'>
          <span className='font-logo text-lg font-semibold uppercase tracking-[0.025em]'>
            Place To Stand
          </span>
          <p className='max-w-md text-sm text-ink-light/70'>
            Your lever in the digital world. As a strategic, design, and
            development partner, we build the tools and foundations that help
            businesses move the world.
          </p>
          <div className='flex gap-3 text-xs uppercase tracking-[0.1em] text-ink-light/50'>
            <span>© {year} Place To Stand. All rights reserved. </span>
            <Link
              className='text-ink-light/50 transition hover:text-white'
              href='/privacy'
            >
              Privacy Policy
            </Link>
            <Link
              className='text-ink-light/50 transition hover:text-white'
              href='/terms'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
