import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/layout/animated-section";

const hashHref = (hash: string) => ({ pathname: "/", hash });

export function HeroSection() {
  return (
    <AnimatedSection
      id="home"
      className="relative flex flex-col items-center gap-10 overflow-hidden rounded-[56px] bg-gradientPrimary px-8 py-28 text-center text-ink shadow-xl"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0)_60%)]" aria-hidden />
      <span className="rounded-full border border-white/40 bg-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink/70">
        Your lever in the digital world
      </span>
      <h1 className="max-w-3xl font-headline text-5xl uppercase leading-tight tracking-[0.1em] text-ink md:text-6xl">
        Businesses don’t need to be huge to make big moves; they just need the right tools and a solid foundation.
      </h1>
      <p className="max-w-2xl text-lg text-ink/80">
        Place To Stand is the strategic, design, and development partner building experiences that help ambitious teams move the world forward.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href={hashHref("work")}>See Our Work</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href={hashHref("contact")}>Talk With Us</Link>
        </Button>
      </div>
    </AnimatedSection>
  );
}
