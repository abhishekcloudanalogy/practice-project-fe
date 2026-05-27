import type { ReactNode } from 'react'
import Sidebar from '@/components/shared/Sidebar'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="w-full overflow-x-hidden pl-23">
        {children}
      </main>
    </div>
  )
}