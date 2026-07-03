import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Partner Management',
  description: 'Manage partner accounts, access levels, and associated programmes.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Partner Management | CloudAnalogy Admin',
    description: 'Administer partner accounts and permissions.',
    type: 'website',
  },
}

export default function AdminPartnerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
