import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { AnimatedSection } from '@/src/components/layout/animated-section'

const hashHref = (hash: string) => ({ pathname: '/', hash })

export function HeroSection() {
  return (
    <section className='relative border-b-2 border-ink'>
      <AnimatedSection
        id='home'
        className='relative flex max-w-none flex-col items-center justify-center gap-8 overflow-hidden bg-gradientPrimary p-8 pt-24 text-center text-ink md:min-h-screen'
      >
        <div
          className='absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0)_60%)]'
          aria-hidden
        />

        {/* Decorative elements */}
        <div
          className='absolute left-10 top-40 hidden h-12 w-12 animate-fade-up border-2 border-ink bg-white shadow-neo md:block'
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className='absolute bottom-32 right-12 hidden h-16 w-16 animate-fade-up rounded-full border-2 border-ink bg-accent shadow-neo md:block'
          style={{ animationDelay: '0.4s' }}
        />

        <h1 className='max-w-5xl text-balance font-headline text-6xl font-bold uppercase !leading-none tracking-tighter text-ink drop-shadow-sm md:text-8xl lg:text-9xl'>
          Your lever in the{' '}
          <span className='inline-block -rotate-2 border-2 border-ink bg-white px-4 py-1 leading-[.9] shadow-neo'>
            digital
          </span>{' '}
          world
        </h1>
        <p className='mt-4 max-w-2xl rotate-1 border-2 border-ink bg-white p-6 text-base font-medium text-ink shadow-neo md:text-lg'>
          Businesses don’t need to be huge to make big moves; they just need the
          right tools and a solid foundation. Place To Stand is the strategic,
          design, and development partner building experiences that help
          ambitious businesses move forward.
        </p>
        <div className='mt-8 flex flex-col items-center gap-6 sm:flex-row'>
          <Button asChild size='lg' className='text-lg'>
            <Link href={hashHref('work')}>See Our Work</Link>
          </Button>
          <Button asChild variant='secondary' size='lg' className='text-lg'>
            <Link href={hashHref('contact')}>Talk With Us</Link>
          </Button>
        </div>
      </AnimatedSection>

      {/* Marquee */}
      <div className='overflow-hidden border-t-2 border-ink bg-ink py-4 text-white'>
        <div className='animate-marquee whitespace-nowrap font-display text-3xl uppercase tracking-widest'>
          Strategy • Design • Development • Marketing • Strategy • Design •
          Development • Marketing • Strategy • Design • Development • Marketing
          • Strategy • Design • Development • Marketing •
        </div>
      </div>
    </section>
  )
}
