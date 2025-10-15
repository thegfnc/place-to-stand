import type { ReactNode } from 'react'
import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'

interface MarketingLayoutProps {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col bg-ink-light'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
