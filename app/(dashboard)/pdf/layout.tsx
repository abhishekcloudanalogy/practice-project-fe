import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'PDF Uploads',
  description: 'Upload and manage PDF documents for data extraction and quote generation.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'PDF Uploads | CloudAnalogy',
    description: 'Intelligent PDF data extraction and management.',
    type: 'website',
  },
}

export default function PdfLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
