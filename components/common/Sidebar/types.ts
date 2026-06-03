import type { ReactNode } from 'react'
import type { SiderProps } from '@/components/common/antd/layout'

export type SidebarItem = {
	key: string
	label: string
	icon: ReactNode
	href?: string
}

export type SidebarProps = {
	$collapsed: boolean
} & Partial<SiderProps>