'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { AnimatedSection } from '@/src/components/layout/animated-section'
import { cn } from '@/src/lib/utils'

type FAQ = {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What types of businesses do you partner with?',
    answer:
      'We specialize in helping brands of all sizes that are ready to upgrade their digital presence—whether you sell products, offer services, or operate as a hybrid. If you are growth-minded and want a partner who can cover strategy through execution, we are a fit.',
  },
  {
    question: 'What is typically included in an engagement?',
    answer:
      'Every project is tailored, but most engagements include customer research, brand and experience strategy, UX/UI design, production-ready web development, and launch support. We also coordinate with your internal team or outside partners to keep workstream momentum moving forward.',
  },
  {
    question: 'How long does a project usually take?',
    answer:
      'This varies from project to project but a focused sprint, such as a landing page or campaign site, can usually ship in 2-4 weeks if all of the assets are ready to go. Full-funnel initiatives that cover brand, product, and marketing touchpoints usually span 8–12 weeks. We partner with you to determine the milestones so you always know what is shipping when.',
  },
  {
    question: 'How do you price your services?',
    answer:
      'We can scope work based on specific deliverables or billable hours with a client specified cap. After an alignment call, we deliver a fixed investment range with clear inclusions, optional add-ons, and payment schedule so you can plan confidently and avoid surprise invoices.',
  },
  {
    question: 'Do you stay involved after launch?',
    answer:
      'Short awnswer is yes! If needed, we can stand up dashboards, measure performance, and schedule optimization cycles so you keep seeing lift after launch. Many clients keep us on retainer for ongoing experiments, new features, and marketing rollouts.',
  },
]

type FAQItemProps = FAQ & {
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  const id = useId()
  const contentId = `${id}-content`
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    if (!isOpen) {
      setMaxHeight(0)
      return
    }

    const updateHeight = () => {
      setMaxHeight(element.scrollHeight)
    }

    updateHeight()

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        updateHeight()
      })

      observer.observe(element)

      return () => {
        observer.disconnect()
      }
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        'mx-auto max-w-4xl overflow-hidden rounded-xl border border-ink/10 bg-white/80 shadow-sm transition-all duration-300 ease-out hover:border-ink/60',
        isOpen ? 'border-ink/10 shadow-lg' : ''
      )}
    >
      <button
        type='button'
        id={id}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className='flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold uppercase tracking-[0.05em] text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40'
      >
        <span className='text-balance'>{question}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'h-5 w-5 shrink-0 text-ink/50 transition-transform duration-300 ease-out',
            isOpen && 'rotate-180 text-ink'
          )}
        />
      </button>
      <div
        id={contentId}
        role='region'
        aria-labelledby={id}
        aria-hidden={!isOpen}
        style={{ maxHeight: isOpen ? `${maxHeight}px` : '0px' }}
        className={cn(
          'overflow-hidden border-t border-transparent transition-all duration-500 ease-in-out',
          isOpen ? 'border-ink/10' : 'opacity-0'
        )}
      >
        <div
          ref={contentRef}
          className='px-6 py-6 text-base text-ink/70 transition-opacity duration-300 ease-out'
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          {answer}
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  return (
    <AnimatedSection id='faq' className='flex flex-col gap-20'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <span className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/60'>
          FAQ
        </span>
        <h2 className='max-w-4xl text-balance font-headline text-3xl font-semibold uppercase !leading-[.9] text-ink md:text-5xl'>
          The answers you’re looking for
        </h2>
        <p className='max-w-2xl text-balance text-lg !leading-snug text-ink/60'>
          The essentials that most clients ask us before we kick off a new
          engagement. Please reach out if you have other questions. We’re happy
          to answer them!
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.question}
            {...faq}
            isOpen={activeIndex === index}
            onToggle={() =>
              setActiveIndex(prev => (prev === index ? null : index))
            }
          />
        ))}
      </div>
    </AnimatedSection>
  )
}
