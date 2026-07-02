import type { TagProps } from 'antd'

export interface AppTagProps extends Omit<TagProps, 'variant'> {
	variant?: 'default' | 'status' | NonNullable<TagProps['variant']>
}
