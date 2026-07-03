import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Deal Registration Detail',
  description: 'Review and complete the details for a specific AI-assisted deal registration submission.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Deal Registration Detail | CloudAnalogy Admin',
    description: 'Detailed deal registration form and submission.',
    type: 'website',
  },
}

export default function DealRegAiDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
