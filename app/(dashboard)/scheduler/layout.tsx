import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Scheduler',
  description: 'Track and manage your meetings — schedule, recurring events, and availability.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Scheduler | CloudAnalogy',
    description: 'Smart meeting scheduler for efficient time management.',
    type: 'website',
  },
}

export default function SchedulerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
