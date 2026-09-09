import type { Metadata } from 'next'
import { AnimatedSection } from '@/src/components/layout/animated-section'
import { BlueprintCorners } from '@/src/components/layout/dot-grid-background'
import { Button } from '@/src/components/ui/button'
import { TrackedLink } from '@/src/components/tracked-link'
import { referralContent as c } from '@/src/lib/referral-content'

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: '/referral' },
  openGraph: {
    title: `${c.meta.title} | Place To Stand`,
    description: c.meta.description,
    url: '/referral',
    siteName: 'Place To Stand',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: `${c.meta.title} | Place To Stand`,
    description: c.meta.description,
  },
}

export default function ReferralPage() {
  return (
    <main className='flex-1 pt-grid-4 pb-grid-4'>
      {/* Hero */}
      <AnimatedSection
        priority
        className='flex flex-col gap-grid-1 pt-grid-1 pb-grid-3'
      >
        <div className='flex flex-col gap-4'>
          <span className='bp-label font-mono'>{c.hero.label}</span>
          <h1 className='max-w-4xl font-headline text-4xl leading-[0.92] font-bold tracking-tight text-balance text-text md:text-6xl'>
            {c.hero.headline}
            <a
              href='#referral-terms'
              aria-label='See referral program terms'
              className='ml-1 align-super font-mono text-[0.45em] font-normal text-accent transition-colors hover:text-accent/80'
            >
              *
            </a>
          </h1>
          <p className='max-w-2xl text-base leading-relaxed text-text-muted md:text-lg'>
            {c.hero.body}
          </p>
        </div>
        <div className='flex flex-col gap-grid-half sm:flex-row sm:items-center sm:gap-grid-1'>
          <Button asChild size='lg' className='w-full sm:w-auto'>
            <TrackedLink href={c.join.href} location='referral-hero'>
              {c.hero.joinLabel}
            </TrackedLink>
          </Button>
          {/*
            A plain anchor rather than next/link: the target is a route handler
            that streams a file, so client-side navigation (and prefetching)
            would generate the PDF once for the router and again for the
            browser's fallback hard navigation.
          */}
          <Button
            asChild
            size='lg'
            variant='outline'
            className='w-full border-2 sm:w-auto'
          >
            <a href='/referral/pdf' download>
              {c.hero.downloadLabel}
            </a>
          </Button>
        </div>
      </AnimatedSection>

      {/* Who we are */}
      <AnimatedSection className='flex flex-col gap-grid-2 py-grid-3'>
        <div className='flex flex-col gap-4'>
          <span className='bp-label font-mono'>{c.whoWeAre.label}</span>
          <h2 className='max-w-3xl font-headline text-3xl leading-[0.95] font-bold tracking-tight text-balance text-text md:text-4xl'>
            {c.whoWeAre.headline}
          </h2>
          <p className='max-w-2xl text-base leading-relaxed text-text-muted'>
            {c.whoWeAre.body}
          </p>
        </div>
        <div className='relative'>
          <BlueprintCorners size={16} />
          <ul className='flex flex-col gap-px border border-border bg-border'>
            {c.whoWeAre.services.map(service => (
              <li
                key={service.name}
                className='grid gap-grid-half bg-bg-card p-grid-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-baseline md:gap-grid-1'
              >
                <h3 className='font-headline text-lg font-semibold tracking-tight text-text'>
                  {service.name}
                </h3>
                <ul className='flex flex-wrap gap-x-6 gap-y-2'>
                  {service.items.map(item => (
                    <li
                      key={item}
                      className='flex items-center gap-2 text-sm text-text-muted'
                    >
                      <span
                        className='h-1.5 w-1.5 shrink-0 bg-accent'
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* Who to refer */}
      <AnimatedSection className='flex flex-col gap-grid-2 py-grid-3'>
        <h2 className='font-headline text-3xl leading-[0.95] font-bold tracking-tight text-text md:text-4xl'>
          {c.whoToSend.label}
        </h2>
        <div className='grid gap-grid-1 md:grid-cols-3'>
          {c.whoToSend.cards.map(card => (
            <div
              key={card.title}
              className='relative flex flex-col gap-grid-half border border-border bg-bg-card p-grid-1'
            >
              <BlueprintCorners size={12} />
              <h3 className='font-headline text-xl font-semibold tracking-tight text-text'>
                {card.title}
              </h3>
              <p className='text-sm leading-relaxed text-text-muted'>
                {card.body}
              </p>
            </div>
          ))}
        </div>
        <div className='grid gap-grid-1 pt-grid-1 md:grid-cols-12 md:gap-grid-2'>
          <div className='flex flex-col gap-grid-half md:col-span-4'>
            <span className='bp-label font-mono'>
              {c.whoToSend.quotesLabel}
            </span>
            <h3 className='font-headline text-2xl leading-tight font-semibold tracking-tight text-balance text-text'>
              {c.whoToSend.leadIn}
            </h3>
          </div>
          <ol className='flex flex-col border-b border-border md:col-span-8'>
            {c.whoToSend.quotes.map((quote, index) => (
              <li
                key={quote}
                className='grid grid-cols-[48px_minmax(0,1fr)] items-baseline gap-3 border-t border-border py-3.5'
              >
                <span className='font-mono text-[11px] tracking-[0.2em] text-accent'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className='text-[17px] leading-normal text-text'>
                  &ldquo;{quote}&rdquo;
                </p>
              </li>
            ))}
          </ol>
        </div>
      </AnimatedSection>

      {/* How it works */}
      <AnimatedSection className='flex flex-col gap-grid-2 py-grid-3'>
        <h2 className='font-headline text-3xl leading-[0.95] font-bold tracking-tight text-text md:text-4xl'>
          {c.howItWorks.label}
        </h2>
        <ol className='grid gap-grid-1 md:grid-cols-3'>
          {c.howItWorks.steps.map(step => (
            <li
              key={step.number}
              className='relative flex flex-col gap-grid-half border border-border bg-bg-card p-grid-1'
            >
              <BlueprintCorners size={12} />
              <span className='inline-flex h-6 w-6 items-center justify-center border border-accent/40 font-mono text-[10px] text-accent'>
                {step.number}
              </span>
              <h3 className='font-headline text-xl font-semibold tracking-tight text-text'>
                {step.title}
              </h3>
              <p className='text-sm leading-relaxed text-text-muted'>
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </AnimatedSection>

      {/* How we work */}
      <AnimatedSection className='flex flex-col gap-grid-2 py-grid-3'>
        <h2 className='font-headline text-3xl leading-[0.95] font-bold tracking-tight text-text md:text-4xl'>
          {c.howWeWork.label}
        </h2>
        <ul className='grid gap-grid-1 md:grid-cols-3'>
          {c.howWeWork.points.map(point => (
            <li
              key={point.title}
              className='relative flex flex-col gap-grid-half border border-border bg-bg-card p-grid-1'
            >
              <BlueprintCorners size={12} />
              <h3 className='font-headline text-xl font-semibold tracking-tight text-text'>
                {point.title}
              </h3>
              <p className='text-sm leading-relaxed text-text-muted'>
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </AnimatedSection>

      {/* Audit callout */}
      <AnimatedSection className='flex flex-col gap-grid-2 pt-grid-3 pb-0'>
        <h2 className='font-headline text-3xl leading-[0.95] font-bold tracking-tight text-text md:text-4xl'>
          {c.audit.heading}
        </h2>
        <div className='relative border border-border bg-bg-card p-grid-1 md:p-grid-2'>
          <BlueprintCorners size={20} all colorClassName='border-accent' />
          <div className='flex flex-col gap-grid-1 md:flex-row md:items-center md:justify-between md:gap-grid-2'>
            <p className='max-w-md text-base leading-relaxed text-text md:text-lg'>
              {c.audit.body}
            </p>
            <Button asChild size='lg' className='w-full shrink-0 sm:w-auto'>
              <TrackedLink
                href={c.audit.href}
                location='referral-audit-callout'
              >
                {c.audit.buttonLabel}
              </TrackedLink>
            </Button>
          </div>
        </div>
        <p
          id='referral-terms'
          className='scroll-mt-grid-4 pt-grid-2 text-center text-sm leading-relaxed text-text-muted'
        >
          <span className='font-mono text-accent' aria-hidden>
            *
          </span>{' '}
          {c.join.note}{' '}
          <TrackedLink
            href={c.join.href}
            location='referral-join-footnote'
            className='font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent/80'
          >
            {c.join.noteCta}
          </TrackedLink>
        </p>
      </AnimatedSection>
    </main>
  )
}
