import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { AnimatedSection } from '@/src/components/layout/animated-section'

const hashHref = (hash: string) => ({ pathname: '/', hash })

export function HeroSection() {
  return (
    <AnimatedSection
      id='home'
      className='relative flex max-w-none flex-col items-center gap-6 overflow-hidden bg-gradientPrimary px-8 pb-44 pt-[260px] text-center text-ink shadow-xl'
    >
      <div
        className='absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0)_60%)]'
        aria-hidden
      />
      <h1 className='max-w-3xl text-balance font-headline text-5xl font-semibold uppercase !leading-[.9] text-ink md:text-6xl'>
        Your lever in the digital world
      </h1>
      <p className='max-w-2xl text-lg text-ink/80'>
        Businesses don’t need to be huge to make big moves; they just need the
        right tools and a solid foundation. Place To Stand is the strategic,
        design, and development partner building experiences that help ambitious
        businesses move forward.
      </p>
      <div className='mt-4 flex flex-col items-center gap-4 sm:flex-row'>
        <Button asChild size='lg'>
          <Link href={hashHref('work')}>See Our Work</Link>
        </Button>
        <Button asChild variant='ghost' size='lg'>
          <Link href={hashHref('contact')}>Talk With Us</Link>
        </Button>
      </div>
    </AnimatedSection>
  )
}
