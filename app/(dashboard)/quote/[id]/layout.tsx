import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Quote Details',
  description: 'Review quote files, edit line items, and analyse profitability for a specific quote.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Quote Details | CloudAnalogy',
    description: 'Detailed quote view with line items and profitability analysis.',
    type: 'website',
  },
}

export default function QuoteDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
