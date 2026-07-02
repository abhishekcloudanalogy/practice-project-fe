import type { InputProps } from 'antd'

export type AppInputProps = Omit<InputProps, 'variant'> & {
	appearance?: 'default' | 'soft'
}