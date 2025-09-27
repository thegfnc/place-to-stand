import { AnimatedSection } from "@/components/layout/animated-section";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start by listening. Our first step is to deeply understand your business, your audience, and your goals."
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We craft a tailored plan. Using the insights from discovery, we build a data-driven strategy to deliver results."
  },
  {
    number: "03",
    title: "Design & Development",
    description:
      "Our team brings the vision to life with pixel-perfect design and clean, scalable code."
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "We launch your project and monitor its performance, making data-informed adjustments to maximize impact."
  }
];

export function HowWeWorkSection() {
  return (
    <AnimatedSection id="how-we-work" className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.4em] text-ink/50">
          How we work
        </span>
        <h2 className="font-headline text-4xl uppercase tracking-[0.1em] text-ink">Our engagement playbook</h2>
        <p className="max-w-2xl text-lg text-ink/70">
          A proven rhythm that keeps projects transparent, collaborative, and relentlessly focused on momentum.
        </p>
      </div>
      <ol className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.number}
            className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-ink/20"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
              {step.number}
            </span>
            <h3 className="mt-2 font-headline text-3xl uppercase tracking-[0.1em] text-ink">
              {step.title}
            </h3>
            <p className="mt-4 text-base text-ink/70">{step.description}</p>
          </li>
        ))}
      </ol>
    </AnimatedSection>
  );
}
