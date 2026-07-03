import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact Details',
  description: 'View and edit detailed information for a specific contact, including activities and notes.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Contact Details | CloudAnalogy',
    description: 'Detailed contact profile and activity.',
    type: 'profile',
  },
}

export default function ContactDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
