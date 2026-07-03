import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Opportunities',
  description: 'Track and manage your sales opportunities — pipeline stages, values, and deal progress.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Opportunities | CloudAnalogy',
    description: 'Sales pipeline and opportunity management.',
    type: 'website',
  },
}

export default function OpportunitiesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
