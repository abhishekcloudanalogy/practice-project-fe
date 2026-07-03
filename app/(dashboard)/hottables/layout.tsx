import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Hot Tables',
  description: 'Manage and explore extracted table data with advanced editing and filtering tools.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Hot Tables | CloudAnalogy',
    description: 'Advanced table data editor and explorer.',
    type: 'website',
  },
}

export default function HotTablesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
