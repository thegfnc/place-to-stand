import { AnimatedSection } from '@/src/components/layout/animated-section'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We start by listening. Our first step is to deeply understand your business, your audience, and your goals.',
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'We craft a tailored plan. Using the insights from discovery, we build a data-driven strategy to deliver results.',
  },
  {
    number: '03',
    title: 'Design & Development',
    description:
      'Our team brings the vision to life with pixel-perfect design and clean, scalable code.',
  },
  {
    number: '04',
    title: 'Launch & Optimize',
    description:
      'We launch your project and monitor its performance, making data-informed adjustments to maximize impact.',
  },
]

export function HowWeWorkSection() {
  return (
    <AnimatedSection id='how-we-work' className='flex flex-col gap-20 py-20'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <span className='border-2 border-ink bg-accent/80 px-4 py-1 text-sm font-bold uppercase tracking-widest text-ink shadow-neo'>
          How we work
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-5xl font-bold uppercase !leading-[.9] tracking-tighter text-ink md:text-7xl'>
          Our engagement playbook
        </h2>
        <p className='max-w-xl text-balance text-lg font-medium text-ink'>
          A proven rhythm that keeps projects transparent, collaborative, and
          relentlessly focused on momentum.
        </p>
      </div>
      <ol className='grid gap-8 md:grid-cols-2'>
        {steps.map(step => (
          <li
            key={step.number}
            className='group relative flex flex-col gap-6 border-2 border-ink bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 hover:shadow-neo-lg'
          >
            <div className='flex items-center justify-between border-b-2 border-ink pb-4'>
              <span className='font-display text-6xl font-bold text-ink/20 transition-colors group-hover:text-accent'>
                {step.number}
              </span>
              <div className='h-4 w-4 bg-ink' />
            </div>
            <h3 className='font-display text-3xl font-bold uppercase text-ink'>
              {step.title}
            </h3>
            <p className='text-lg font-medium text-ink/80'>
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </AnimatedSection>
  )
}
