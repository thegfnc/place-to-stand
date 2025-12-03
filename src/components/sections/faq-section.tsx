'use client'

import { useId, useState } from 'react'
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

  return (
    <div
      className={cn(
        'mx-auto max-w-4xl overflow-hidden border-2 border-ink bg-white shadow-neo transition-all duration-300 ease-out hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-neo-lg',
        isOpen ? '-translate-y-0.5 translate-x-0.5 shadow-neo-lg' : ''
      )}
    >
      <button
        type='button'
        id={id}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className='flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-xl font-bold uppercase tracking-wide text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
      >
        <span className='text-balance font-display'>{question}</span>
        <div
          className={cn(
            'border-2 border-ink p-1 transition-transform duration-300',
            isOpen && 'rotate-180 bg-accent/80'
          )}
        >
          <ChevronDown aria-hidden className='h-5 w-5 shrink-0 text-ink' />
        </div>
      </button>
      <div
        id={contentId}
        role='region'
        aria-labelledby={id}
        aria-hidden={!isOpen}
        className={cn(
          'grid overflow-hidden border-t-2 border-transparent transition-all duration-500 ease-in-out',
          isOpen ? 'grid-rows-[1fr] border-ink' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className='overflow-hidden'>
          <div
            className={cn(
              'px-6 py-6 text-lg font-medium text-ink/80 transition-opacity duration-300 ease-out',
              isOpen ? 'opacity-100' : 'opacity-0'
            )}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <AnimatedSection id='faq' className='flex flex-col gap-20 py-20'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <span className='border-2 border-ink bg-accent/80 px-4 py-1 text-sm font-bold uppercase tracking-widest text-ink shadow-neo'>
          FAQ
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-5xl font-bold uppercase !leading-[.9] tracking-tighter text-ink md:text-7xl'>
          Common questions
        </h2>
        <p className='max-w-xl text-balance text-lg font-medium text-ink'>
          Everything you need to know about how we work and what to expect.
        </p>
      </div>
      <div className='flex flex-col gap-6'>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            {...faq}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </AnimatedSection>
  )
}
