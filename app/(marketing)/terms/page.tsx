export const metadata = {
  title: 'Terms of Service | Place To Stand',
  description:
    'Understand the engagement terms, responsibilities, and usage guidelines when partnering with Place To Stand.',
}

export default function TermsPage() {
  return (
    <main className='mx-auto mt-28 flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-24'>
      <section className='space-y-4'>
        <h1 className='font-headline text-5xl uppercase tracking-[0.1em] text-ink'>
          Terms of Service
        </h1>
        <p className='text-base text-ink/70'>
          These terms outline the general conditions under which Place To Stand
          delivers strategy, design, and development services. The content below
          acts as a placeholder until the full legal agreement is finalised.
        </p>
      </section>
      <section className='space-y-3 text-sm text-ink/70'>
        <h2 className='font-headline text-2xl uppercase tracking-[0.2em] text-ink'>
          Highlights
        </h2>
        <ul className='space-y-2'>
          <li>
            • Engagements begin with a mutual statement of work defining scope,
            deliverables, and timeline.
          </li>
          <li>
            • Intellectual property is transferred to the client upon receipt of
            final payment, unless otherwise agreed.
          </li>
          <li>
            • Clients agree to provide timely feedback and access to the
            resources required to complete the project.
          </li>
        </ul>
      </section>
    </main>
  )
}
