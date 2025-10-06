import Image from 'next/image'
import { AnimatedSection } from '@/src/components/layout/animated-section'

const team = [
  {
    name: 'Jason Desiderio',
    title: 'Principal Engineer',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Damon Bodine',
    title: 'Project Manager & AI Strategist',
    image:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kris Crawford',
    title: 'AI Software Engineer',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Chris Donahue',
    title: 'Copywriting & Visual Media',
    image:
      'https://images.unsplash.com/photo-1544723795-3fbced1ae214?auto=format&fit=crop&w=800&q=80',
  },
]

export function TeamSection() {
  return (
    <AnimatedSection id='team' className='flex flex-col gap-20'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <span className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/60'>
          Team
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-3xl font-semibold uppercase !leading-[.9] text-ink md:text-5xl'>
          The people behind the lever
        </h2>
        <p className='max-w-xl text-balance text-lg !leading-snug text-ink/60'>
          Strategists, storytellers, and engineers working in concert to deliver
          measurable impact.
        </p>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {team.map(member => (
          <article
            key={member.name}
            className='group flex flex-col gap-6 rounded-xl border border-ink/10 bg-white/80 p-6 text-center shadow-lg backdrop-blur transition duration-500 hover:-translate-y-1'
          >
            <div className='relative mx-auto h-40 w-40 overflow-hidden rounded-full'>
              <Image
                src={member.image}
                alt={`${member.name}, ${member.title}`}
                fill
                className='object-cover transition duration-700 group-hover:scale-105'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='font-headline text-2xl uppercase leading-none'>
                {member.name}
              </h3>
              <p className='text-sm text-ink/60'>{member.title}</p>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}
