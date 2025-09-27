import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-ink-light">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="font-logo text-lg uppercase tracking-[0.3em]">Place To Stand</span>
          <p className="max-w-md text-sm text-ink-light/70">
            Your lever in the digital world. We build the foundations that help small businesses move the world.
          </p>
          <span className="text-xs uppercase tracking-[0.3em] text-ink-light/50">
            © {year} Place To Stand. All rights reserved.
          </span>
        </div>
        <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.3em]">
          <div className="flex gap-4">
            <Link className="transition hover:text-white" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="transition hover:text-white" href="/terms">
              Terms of Service
            </Link>
          </div>
          <div className="flex gap-4">
            <Link className="transition hover:text-white" href="https://instagram.com" aria-label="Instagram">
              Instagram
            </Link>
            <Link className="transition hover:text-white" href="https://linkedin.com" aria-label="LinkedIn">
              LinkedIn
            </Link>
            <Link className="transition hover:text-white" href="https://dribbble.com" aria-label="Dribbble">
              Dribbble
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
