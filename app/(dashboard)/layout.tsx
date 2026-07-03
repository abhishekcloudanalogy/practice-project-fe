import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import DashboardHeader from '@/components/layout/DashboardHeader'
import Navbar from '@/components/layout/Navbar'

import { SidebarProvider } from '@/store/features/dashboard/sidebarContext'
import NavbarGuard from '@/components/layout/NavbarGuard'

type DashboardLayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | CloudAnalogy',
  },
  description: 'Manage your quotes, customers, contacts, and opportunities from your CloudAnalogy dashboard.',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-[calc(100vh-var(--navbar-height))] bg-slate-50 text-slate-900">
        <DashboardHeader />
        <Sidebar />
        <main
          className="w-full overflow-x-hidden pt-(--navbar-height) transition-[padding-left] duration-200"
          style={{
            paddingLeft: 'var(--sidebar-width, 92px)',
            minHeight: 'calc(100vh - var(--navbar-height))',
          }}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
