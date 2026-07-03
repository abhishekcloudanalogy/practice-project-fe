import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Table Extraction',
  description: 'View and edit extracted table data from uploaded PDF documents.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Table Extraction | CloudAnalogy',
    description: 'Edit and manage PDF-extracted table data.',
    type: 'website',
  },
}

export default function PdfDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
