import Image from 'next/image'
import { AnimatedSection } from '@/src/components/layout/animated-section'

const team = [
  {
    name: 'Jason Desiderio',
    title: 'Principal Engineer',
    image: '/1652631488914.jpeg',
  },
  {
    name: 'Damon Bodine',
    title: 'Project Manager & AI Strategist',
    image: '/1587649018078.jpeg',
  },
  {
    name: 'Kris Crawford',
    title: 'Software Engineer & AI Technologist',
    image: '/259858081_219018533698595_237774923102850579_n.jpg',
  },
  {
    name: 'Chris Donahue',
    title: 'Creative Director',
    image: '/403081575_325440200226266_2592020462209657049_n.jpg',
  },
]

export function TeamSection() {
  return (
    <AnimatedSection id='team' className='flex flex-col gap-20 py-20'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <span className='border-2 border-ink bg-accent/80 px-4 py-1 text-sm font-bold uppercase tracking-widest text-ink shadow-neo'>
          Team
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-5xl font-bold uppercase !leading-[.9] tracking-tighter text-ink md:text-7xl'>
          The people behind the lever
        </h2>
        <p className='max-w-xl text-balance text-lg font-medium text-ink'>
          Strategists, storytellers, and engineers working in concert to deliver
          measurable impact.
        </p>
      </div>
      <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
        {team.map(member => (
          <article
            key={member.name}
            className='flex flex-col gap-6 border-2 border-ink bg-white p-6 text-center shadow-neo transition-all duration-300'
          >
            <div className='relative mx-auto aspect-square w-full overflow-hidden border-2 border-ink shadow-neo'>
              <Image
                src={member.image}
                alt={`${member.name}, ${member.title}`}
                fill
                className='object-cover transition-all duration-500'
              />
            </div>
            <div className='space-y-2'>
              <h3 className='font-display text-2xl font-bold uppercase text-ink'>
                {member.name}
              </h3>
              <p className='text-sm font-semibold uppercase tracking-normal text-ink/60'>
                {member.title}
              </p>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}
