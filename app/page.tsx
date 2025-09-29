import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'
import { HeroSection } from '@/src/components/sections/hero-section'
import { AboutSection } from '@/src/components/sections/about-section'
import { ServicesSection } from '@/src/components/sections/services-section'
import { HowWeWorkSection } from '@/src/components/sections/how-we-work-section'
import { TeamSection } from '@/src/components/sections/team-section'
import { WorkSection } from '@/src/components/sections/work-section'
import { ContactSection } from '@/src/components/sections/contact-section'

export default function HomePage() {
  return (
    <div className='relative flex min-h-screen flex-col bg-ink-light'>
      <Header />
      <main className='flex-1 pt-32'>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <HowWeWorkSection />
        <TeamSection />
        <WorkSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
