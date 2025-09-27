import { AnimatedSection } from "@/components/layout/animated-section";

export function AboutSection() {
  return (
    <AnimatedSection id="about" className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-ink/50">
          Archimedes would be proud
        </p>
        <h2 className="font-headline text-4xl uppercase tracking-[0.1em] text-ink">Place To Stand is your digital lever</h2>
        <p className="text-lg leading-relaxed text-ink/80">
          Archimedes famously said, “Give me a place to stand and a lever and I will move the world.” At Place To Stand, we build that place for you in the digital world. We are a passionate team of developers, designers, and strategists dedicated to providing small businesses with the leverage they need to compete and succeed. We believe in smart strategy, beautiful design, and powerful technology that is both aspirational and attainable.
        </p>
      </div>
      <div className="rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur">
        <h3 className="font-headline text-2xl uppercase tracking-[0.2em] text-ink">Outcomes over buzzwords</h3>
        <p className="mt-4 text-base text-ink/70">
          AI is a tool, not a sellable product. Our clients partner with us because we translate emerging technology into tangible business results—new revenue streams, efficient operations, and memorable customer experiences.
        </p>
      </div>
    </AnimatedSection>
  );
}
