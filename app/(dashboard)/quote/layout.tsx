import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Quotes',
  description: 'Create, manage, and track all your quotes. Review line items, approve files, and analyse profitability.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Quotes | CloudAnalogy',
    description: 'End-to-end quote management and profitability analysis.',
    type: 'website',
  },
}

export default function QuotesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
