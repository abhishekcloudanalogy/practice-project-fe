import type { ReactNode } from 'react'
import Sidebar from '@/components/shared/Sidebar'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="w-full overflow-x-hidden pl-23">
        {children}
      </main>
    </div>
  )
}