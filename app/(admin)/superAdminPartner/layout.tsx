import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Super Admin — Partners',
  description: 'Super-administrator view for managing all partner organisations and their permissions.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Super Admin Partners | CloudAnalogy',
    description: 'Global partner administration for platform super-admins.',
    type: 'website',
  },
}

export default function SuperAdminPartnerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
