import { HeroSection } from '@/src/components/sections/hero-section'
import { ServicesSection } from '@/src/components/sections/services-section'
import { HowWeWorkSection } from '@/src/components/sections/how-we-work-section'
import { TeamSection } from '@/src/components/sections/team-section'
import { WorkSection } from '@/src/components/sections/work-section'
import { FaqSection } from '@/src/components/sections/faq-section'
import { ContactSection } from '@/src/components/sections/contact-section'

export default function HomePage() {
  return (
    <main className='flex-1'>
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <HowWeWorkSection />
      <TeamSection />
      <FaqSection />
      <ContactSection />
    </main>
  )
}
