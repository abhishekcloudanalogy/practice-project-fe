import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Table Editor',
  description: 'Edit, update column mappings, and manage rows for a specific extracted PDF table.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Table Editor | CloudAnalogy',
    description: 'Full-featured editor for PDF-extracted table data.',
    type: 'website',
  },
}

export default function HotTableDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
