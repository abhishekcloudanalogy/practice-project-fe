import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Manage your customer accounts — view, search, and organize all customer records.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Customers | CloudAnalogy',
    description: 'Full customer relationship management.',
    type: 'website',
  },
}

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
