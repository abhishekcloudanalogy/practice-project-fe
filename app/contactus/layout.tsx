import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the CloudAnalogy team. We are here to help with questions, demos, and support.',
  keywords: ['contact', 'support', 'CloudAnalogy', 'help', 'enquiry'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contact Us | CloudAnalogy',
    description: 'Reach out to the CloudAnalogy team for support or enquiries.',
    type: 'website',
  },
}

export default function ContactUsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
