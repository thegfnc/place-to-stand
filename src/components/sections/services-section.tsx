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
    title: 'Automations + Integrations Set Up',
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
    <AnimatedSection id='services' className='flex flex-col gap-20 py-20'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <span className='border-2 border-ink bg-accent/80 px-4 py-1 text-sm font-bold uppercase tracking-widest text-ink shadow-neo'>
          Services
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-5xl font-bold uppercase !leading-[.9] tracking-tighter text-ink md:text-7xl'>
          Leverage we bring to every engagement
        </h2>
        <p className='max-w-xl text-balance text-lg font-medium text-ink'>
          From first idea to lasting growth, every service is designed to put
          you on firmer ground and amplify your next move.
        </p>
      </div>
      <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
        {services.map(({ title, description, icon: Icon }) => (
          <Card key={title} className='h-full'>
            <CardHeader className='mb-4 gap-5'>
              <div className='w-fit border-2 border-ink bg-accent/80 p-3 shadow-neo transition-transform group-hover:rotate-3'>
                <Icon className='h-8 w-8 text-ink' />
              </div>
              <CardTitle className='text-3xl'>{title}</CardTitle>
            </CardHeader>
            <CardContent className='text-lg font-medium text-ink/80'>
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  )
}
