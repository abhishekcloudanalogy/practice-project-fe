import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Customer Details',
  description: 'View full customer profile including opportunities, contacts, and associated quotes.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Customer Details | CloudAnalogy',
    description: 'Detailed customer profile with linked opportunities and contacts.',
    type: 'profile',
  },
}

export default function CustomerDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
