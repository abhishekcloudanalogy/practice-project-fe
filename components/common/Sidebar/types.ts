import type { ReactNode } from 'react'

export type SidebarItem = {
	key: string
	label: string
	icon: ReactNode
	href?: string
}