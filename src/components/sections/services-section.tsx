import { AnimatedSection } from '@/src/components/layout/animated-section'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import {
  LucideIcon,
  BrainCircuit,
  Code2,
  PlugZap2,
  Camera,
  Video,
  PenTool,
  Palette,
  Mail,
  Share2,
} from 'lucide-react'

const services: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: 'Digital Strategy',
    description:
      'Clear positioning, customer personas, and measurable roadmaps that align every move to your business goals.',
    icon: BrainCircuit,
  },
  {
    title: 'Full-stack Software Development',
    description:
      'Modern web and mobile applications engineered for resilience, performance, and maintainability.',
    icon: Code2,
  },
  {
    title: 'Integrations Set Up',
    description:
      'Connect your tools and data sources so automation becomes your competitive advantage.',
    icon: PlugZap2,
  },
  {
    title: 'Photography',
    description:
      'Capture the soul of your brand through art-directed, high-impact photography sessions.',
    icon: Camera,
  },
  {
    title: 'Video Shooting + Editing',
    description:
      'Tell your story through cinematic visuals and narrative editing that keep audiences engaged.',
    icon: Video,
  },
  {
    title: 'Copywriting',
    description:
      'Words with gravity—crafted to convert while sounding unmistakably like you.',
    icon: PenTool,
  },
  {
    title: 'Design',
    description:
      'Premium visual systems and interfaces that feel as good as they look, across every device.',
    icon: Palette,
  },
  {
    title: 'Email Newsletter',
    description:
      'From strategy to send, keep customers in the loop with campaigns that deliver value.',
    icon: Mail,
  },
  {
    title: 'Social Media Strategy',
    description:
      'Own the conversation with a consistent presence that speaks your audience’s language.',
    icon: Share2,
  },
]

export function ServicesSection() {
  return (
    <AnimatedSection id='services' className='flex flex-col gap-20'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <span className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/60'>
          Services
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-3xl font-semibold uppercase !leading-[.9] text-ink md:text-5xl'>
          Leverage we bring to every engagement
        </h2>
        <p className='max-w-xl text-balance text-lg !leading-snug text-ink/60'>
          From first idea to lasting growth, every service is designed to put
          you on firmer ground and amplify your next move.
        </p>
      </div>
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {services.map(({ title, description, icon: Icon }) => (
          <Card key={title} className='border border-ink/10'>
            <CardHeader className='mb-2 gap-5'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/80 text-ink-light'>
                <Icon className='h-4 w-4' aria-hidden />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  )
}
