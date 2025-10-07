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
    title: 'AI Software Engineer',
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
            <div className='relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-ink/20'>
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
