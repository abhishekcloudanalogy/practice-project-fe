import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Deal Registration AI',
  description: 'AI-powered deal registration workflows — select programmes, fill forms, and submit registrations.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Deal Registration AI | CloudAnalogy Admin',
    description: 'Intelligent deal registration with AI assistance.',
    type: 'website',
  },
}

export default function DealRegAiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
