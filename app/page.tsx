import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesSection } from "@/components/sections/services-section";
import { HowWeWorkSection } from "@/components/sections/how-we-work-section";
import { TeamSection } from "@/components/sections/team-section";
import { WorkSection } from "@/components/sections/work-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink-light">
      <Header />
      <main className="flex-1 pt-32">
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
  );
}
