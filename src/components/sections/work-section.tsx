import Image from 'next/image'
import { AnimatedSection } from '@/src/components/layout/animated-section'

type Project = {
  title: string
  href: string
  image: string
  description: string
}

const projects: Project[] = [
  {
    title: 'Hot Ones',
    href: 'https://hotones.com',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description:
      'The official online sauce shop for the hit interview show "Hot Ones.',
  },
  {
    title: 'Blake Brown Beauty',
    href: 'https://blakebrownbeauty.com',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description:
      'A direct-to-consumer brand focused on healthy, high-performance haircare founded by Blake Lively',
  },
  {
    title: 'Heatonist',
    href: 'https://heatonist.com',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80',
    description:
      "A curated marketplace for the world's best small-batch hot sauces.",
  },
  {
    title: 'Florence by Mills Beauty',
    href: 'https://florencebymillsbeauty.com',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80',
    description:
      'A clean beauty and skincare line founded by Millie Bobby Brown.',
  },
  {
    title: '9 Point Studios',
    href: 'https://9pointstudios.com',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      'A world-class recording and video production facility for creative artists.',
  },
  {
    title: 'Officina del Bere 1397',
    href: 'https://officinadelbere1397.com',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      'A specialty shop offering elegant, functional wine and bar accessories.',
  },
  {
    title: 'The Good for Nothings Club',
    href: 'https://www.thegoodfornothings.club',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    description:
      'A creators club from Austin, TX for designers, filmmakers, musicians, and writers.',
  },
  {
    title: 'Lifepacks',
    href: 'https://www.lifepacks.co',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    description:
      'Easily create product guides and earn commission, just like the pros at Wirecutter and Consumer Reports.',
  },
]

export function WorkSection() {
  return (
    <AnimatedSection id='work' className='flex flex-col gap-20'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <span className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/60'>
          Work
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-3xl font-semibold uppercase !leading-[.9] text-ink md:text-5xl'>
          Selected projects that moved the needle
        </h2>
        <p className='max-w-xl text-balance text-lg !leading-snug text-ink/60'>
          A look at the product, marketing, and brand experiences we craft with
          our partners.
        </p>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        {projects.map(project => (
          <a
            key={project.title}
            href={project.href}
            target='_blank'
            rel='noreferrer noopener'
            aria-label={`View ${project.title} project (opens in a new tab)`}
            className='group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white/80 shadow-lg backdrop-blur transition duration-500 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/40'
          >
            <div className='relative h-64 w-full overflow-hidden'>
              <Image
                src={project.image}
                alt={`${project.title} project thumbnail`}
                fill
                className='object-cover transition duration-500 group-hover:scale-105 group-focus-visible:scale-105'
              />
            </div>
            <div className='flex grow flex-col justify-between gap-3 p-6'>
              <div className='flex flex-col gap-3'>
                <h3 className='font-headline text-2xl uppercase leading-none'>
                  {project.title}
                </h3>
                <p className='text-base !leading-snug text-ink/60'>
                  {project.description}
                </p>
              </div>
              <span className='inline-flex items-center gap-2 text-sm font-semibold uppercase text-ink transition group-hover:text-ink/70 group-focus-visible:text-ink/70'>
                View Project
                <span
                  aria-hidden
                  className='transition-transform duration-500 group-hover:translate-x-1'
                >
                  →
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </AnimatedSection>
  )
}
