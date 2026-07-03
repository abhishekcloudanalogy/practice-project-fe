import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new CloudAnalogy account to start managing your quotes, customers, and sales pipeline.',
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Create Account | CloudAnalogy',
    description: 'Get started with CloudAnalogy.',
    type: 'website',
  },
}

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
