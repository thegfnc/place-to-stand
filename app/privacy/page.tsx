export const metadata = {
  title: 'Privacy Policy | Place To Stand',
  description:
    'Learn how Place To Stand collects, uses, and protects your personal information when you engage with our services.',
}

export default function PrivacyPage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-24'>
      <section className='space-y-4'>
        <h1 className='font-headline text-5xl uppercase tracking-[0.1em] text-ink'>
          Privacy Policy
        </h1>
        <p className='text-base text-ink/70'>
          We respect your privacy and are committed to safeguarding your data.
          This placeholder page summarises how we collect, use, and protect
          information submitted through our contact form and other interactions
          with Place To Stand. A fully detailed policy will be published prior
          to launch.
        </p>
      </section>
      <section className='space-y-3 text-sm text-ink/70'>
        <h2 className='font-headline text-2xl uppercase tracking-[0.2em] text-ink'>
          Key Principles
        </h2>
        <ul className='space-y-2'>
          <li>
            • We only collect information necessary to respond to your
            enquiries.
          </li>
          <li>• We never sell your personal data to third parties.</li>
          <li>
            • You may request data removal or updates at any time by contacting
            hello@placetostandagency.com.
          </li>
        </ul>
      </section>
    </main>
  )
}
