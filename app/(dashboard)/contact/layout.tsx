import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contacts',
  description: 'View and manage all your business contacts — add, edit, filter, and track contact details.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Contacts | CloudAnalogy',
    description: 'Manage all your business contacts in one place.',
    type: 'website',
  },
}

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
