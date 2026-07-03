import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and update your CloudAnalogy profile settings, preferences, and account details.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'My Profile | CloudAnalogy',
    description: 'Manage your account settings and preferences.',
    type: 'profile',
  },
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
