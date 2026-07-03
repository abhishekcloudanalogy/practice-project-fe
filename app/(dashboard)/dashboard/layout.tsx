import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your quotes, customers, contacts, and opportunities at a glance.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Dashboard | CloudAnalogy',
    description: 'Overview of your business activity.',
    type: 'website',
  },
}

export default function DashboardPageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
