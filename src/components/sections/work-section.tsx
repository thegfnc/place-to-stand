import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/layout/animated-section";

type Project = {
  title: string;
  href: string;
  image: string;
  description: string;
};

const projects: Project[] = [
  {
    title: "Lift & Shift Logistics",
    href: "https://liftandshift.co",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description: "Operations overhaul and digital customer portal for a regional logistics firm."
  },
  {
    title: "Kindred Coffee Company",
    href: "https://kindredcoffee.com",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
    description: "E-commerce experience with storytelling product drops and loyalty program."
  },
  {
    title: "Evergreen Learning",
    href: "https://evergreenlearning.org",
    image:
      "https://images.unsplash.com/photo-1523419409543-0c1df022bdd5?auto=format&fit=crop&w=1200&q=80",
    description: "Integrated LMS and marketing site for an education non-profit."
  },
  {
    title: "Brightside Clinics",
    href: "https://brightsideclinics.com",
    image:
      "https://images.unsplash.com/photo-1580281658629-6380ecad2c76?auto=format&fit=crop&w=1200&q=80",
    description: "Telehealth appointment scheduling and brand refresh for a healthcare network."
  },
  {
    title: "Northwind Ventures",
    href: "https://northwind.vc",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    description: "Portfolio storytelling and investor relations hub for a venture studio."
  },
  {
    title: "Atlas Outdoor",
    href: "https://atlasoutdoorgear.com",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
    description: "Immersive product catalog with AR previews for an outdoor equipment brand."
  }
];

export function WorkSection() {
  return (
    <AnimatedSection id="work" className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.4em] text-ink/50">
          Work
        </span>
        <h2 className="font-headline text-4xl uppercase tracking-[0.1em] text-ink">
          Selected engagements that moved the needle
        </h2>
        <p className="max-w-2xl text-lg text-ink/70">
          A look at the product, marketing, and brand experiences we craft with our partners.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group overflow-hidden rounded-3xl border border-ink/10 bg-white/80 shadow-lg backdrop-blur transition hover:-translate-y-1"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={project.image}
                alt={`${project.title} project thumbnail`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-3 p-6">
              <h3 className="font-headline text-2xl uppercase tracking-[0.2em] text-ink">
                {project.title}
              </h3>
              <p className="text-sm text-ink/60">{project.description}</p>
              <Link
                href={project.href}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-ink transition hover:text-ink/70"
              >
                View Project
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
