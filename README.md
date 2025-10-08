# Place To Stand — Agency Website

## Overview

Place To Stand is a single-page brochure site for a boutique digital agency. The build uses Next.js (App Router) with TypeScript and Tailwind CSS to deliver a performant, accessible marketing experience that converts visitors into qualified leads.

> Guiding principle: “Give me a place to stand and a lever and I will move the world.” – Archimedes

### Core Messaging

- **Tagline:** Your lever in the digital world.
- **Hero headline:** Businesses don't need to be huge to make big moves; they just need the right tools and a solid foundation.
- We sell business outcomes powered by thoughtful use of AI—not “AI” as a product.

## Live Targets & Success Metrics

- Google PageSpeed Insights ≥ 90 (mobile & desktop)
- Contact form conversion rate ≥ 2%
- Average time on page ≥ 60 seconds

## Tech Stack

| Concern              | Tooling                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Framework            | Next.js (App Router, TypeScript)                                                             |
| Styling              | Tailwind CSS + shadcn/ui                                                                     |
| Forms & Validation   | React Hook Form + Zod                                                                        |
| Email Delivery       | Resend                                                                                       |
| Analytics            | Vercel Analytics                                                                             |
| Linting & Formatting | ESLint (`eslint-config-next`, `eslint-plugin-react`, `eslint-plugin-react-hooks`) + Prettier |

## Design & Brand Highlights

- **Palette:** Linear gradient #BE93C5 → #7BC6CC, accent #A3A6C7, dark text #111827, light text #F9FAFB.
- **Typography:** Afacad (logo), Bebas Neue (headings/subtitles), Source Sans Pro (body). Load via Google Fonts.
- **Motion:** Soft fade + 10px upward translate on scroll-in for each section.
- **Accessibility:** WCAG 2.1 AA. Enforce semantic structure, high contrast, keyboard navigation, focus outlines, labeled form controls, and descriptive alt text.

## Information Architecture

Single-page layout with sticky header navigation that smooth-scrolls to each section ID.

| Section ID     | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `#home`        | Hero headline, tagline, primary CTA (“See Our Work”) -> `#work`         |
| `#about`       | Agency story + philosophy                                               |
| `#services`    | Grid of shadcn UI Cards with service icon, title, description           |
| `#how-we-work` | Numbered 4-step process                                                 |
| `#team`        | Team card grid (photo, name, title)                                     |
| `#work`        | Portfolio thumbnails + titles                                           |
| `#contact`     | Contact form (name, email, message) with validation + Resend submission |
| Footer         | Copyright, legal links, socials                                         |

## Repo Structure

```
app/
	layout.tsx
	page.tsx
	components/
	lib/
	styles/
public/
	fonts/
	media/
```

> Keep shared primitives under `src/components/ui`, layout pieces under `src/components/layout`, and page sections under `src/components/sections` for clarity.

## Getting Started

```bash
pnpm install
pnpm dev
```

Environment variables:

- `RESEND_API_KEY` — required for contact form submission
- `RESEND_AUDIENCE_ID` — optional; defaults to `469b29de-2269-47c7-81c6-6a294e181e14` for lead capture
- `ASANA_ACCESS_TOKEN` — required; personal access token with permission to create tasks
- `ASANA_WORKSPACE_GID` — required; workspace that owns the leads board
- `ASANA_PROJECT_GID` — required; project (leads board) to receive new tasks
- `ASANA_SECTION_GID` — optional; board column for new tasks
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` — optional if using Vercel Analytics locally

## Development Workflow

1. Branch from `main` with `feat/<short-description>` naming.
2. Implement changes alongside unit/visual coverage when applicable.
3. Run quality gates:
   - `npm run lint`
   - `npm run test` (if tests exist)
   - `npm run type-check`
4. Submit a PR referencing relevant spec sections.

## Section Contracts

Each section component should expose a simple contract:

- Accept props for content overrides to support future CMS integration.
- Animate in using Intersection Observer hooks with reduced-motion fallbacks.
- Ensure responsive layouts (mobile-first, min 320px).

### Contact Form Requirements

- Use React Hook Form with Zod resolver.
- Schema:
  - `name`: string, min 2 characters
  - `email`: string, valid email
  - `message`: string, min 10 characters
- Inline error text in red under each field.
- Loading state on submission.
- Toast notifications: success (“Thank you! Your message has been sent.”) and failure (“Something went wrong. Please try again.”)
- Server action posts to Resend for email delivery.

## Performance & Accessibility Checklist

- Optimize hero/media assets (next/image, responsive sizes).
- Prefetch navigation targets with smooth scrolling.
- Respect `prefers-reduced-motion` for animations.
- Provide visual focus states compliant with contrast guidelines.

## Deployment

- Hosted on Vercel. CI should run lint, build, and tests before deploy.
- Ensure `robots.txt` allows crawlers and `sitemap.xml` reflects all anchors.

## Reference Docs

- [`README.md`](./README.md) — project overview (this file)
- [`DESIGN.md`](./DESIGN.md) — visual language & accessibility
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — section specs & SEO
- [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) — phased roadmap & KPIs

For questions or clarifications, document assumptions directly in PR descriptions and update this README as architecture evolves.
