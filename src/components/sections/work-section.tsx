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
    image: '/work-hot-ones.png',
    description:
      'The official online sauce shop for the hit interview show "Hot Ones.',
  },
  {
    title: 'Blake Brown Beauty',
    href: 'https://blakebrownbeauty.com',
    image: '/work-blake-brown-beauty.png',
    description:
      'A direct-to-consumer brand focused on healthy, high-performance haircare founded by Blake Lively.',
  },
  {
    title: 'Heatonist',
    href: 'https://heatonist.com',
    image: '/work-heatonist.png',
    description:
      "A curated marketplace for the world's best small-batch hot sauces.",
  },
  {
    title: 'Florence by Mills Beauty',
    href: 'https://florencebymillsbeauty.com',
    image: '/work-florence-by-mills-beauty.png',
    description:
      'A clean beauty and skincare line founded by Millie Bobby Brown.',
  },
  {
    title: '9 Point Studios',
    href: 'https://9pointstudios.com',
    image: '/work-9-point-studios.png',
    description:
      'A world-class recording and video production facility for creative artists.',
  },
  {
    title: 'Officina del Bere 1397',
    href: 'https://officinadelbere1397.com',
    image: '/work-officina-del-bere-1397.png',
    description:
      'A specialty shop offering elegant, functional wine and bar accessories.',
  },
  {
    title: 'The Good for Nothings Club',
    href: 'https://www.thegoodfornothings.club',
    image: '/work-the-good-for-nothings-club.png',
    description:
      'A creators club from Austin, TX made up of designers, engineers, filmmakers, musicians, and writers.',
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
    <AnimatedSection id='work' className='flex flex-col gap-20 py-20'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <span className='border-2 border-ink bg-accent/80 px-4 py-1 text-sm font-bold uppercase tracking-widest text-ink shadow-neo'>
          Work
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-5xl font-bold uppercase !leading-[.9] tracking-tighter text-ink md:text-7xl'>
          Select projects that moved the needle
        </h2>
        <p className='max-w-xl text-balance text-lg font-medium text-ink'>
          A look at the product, marketing, and brand experiences we craft with
          our partners.
        </p>
      </div>
      <div className='grid gap-8 md:grid-cols-2'>
        {projects.map(project => (
          <a
            key={project.title}
            href={project.href}
            target='_blank'
            rel='noreferrer noopener'
            aria-label={`View ${project.title} project (opens in a new tab)`}
            className='group flex flex-col border-2 border-ink bg-white shadow-neo transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 hover:shadow-neo-lg focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
          >
            <div className='relative aspect-video w-full overflow-hidden border-b-2 border-ink'>
              <Image
                src={project.image}
                alt={`${project.title} project thumbnail`}
                fill
                className='object-cover transition-transform duration-500'
              />
            </div>
            <div className='flex grow flex-col justify-between gap-4 p-6'>
              <div className='flex flex-col gap-2'>
                <h3 className='font-display text-3xl font-bold uppercase text-ink'>
                  {project.title}
                </h3>
                <p className='text-lg font-medium text-ink/80'>
                  {project.description}
                </p>
              </div>
              <span className='inline-flex w-fit items-center gap-2 border-2 border-ink bg-accent/80 px-4 py-2 text-sm font-bold uppercase tracking-wider text-ink shadow-neo transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:shadow-neo-lg'>
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
