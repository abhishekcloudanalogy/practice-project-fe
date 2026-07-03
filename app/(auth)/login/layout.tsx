import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your CloudAnalogy account to manage quotes, customers, and business opportunities.',
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Sign In | CloudAnalogy',
    description: 'Access your CloudAnalogy account.',
    type: 'website',
  },
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
