import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Merged Tables',
  description: 'View and edit the merged and deduplicated table data from all your uploaded PDFs.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Merged Tables | CloudAnalogy',
    description: 'Consolidated view of all extracted PDF table data.',
    type: 'website',
  },
}

export default function PdfMergedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
