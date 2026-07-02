import type { ButtonProps as AntdButtonProps } from 'antd'

export type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'danger-light'
  | 'auth'
  | 'signin'
  | 'logout'
  | 'dropdown'
  | 'icon-button-1'
  | 'icon-button-2'
  | 'soft'
  | 'ghost'
  | 'dashed'
  | 'eye-button'

export type SharedButtonVariant = AppButtonVariant | NonNullable<AntdButtonProps['variant']>

export interface AppButtonProps extends Omit<AntdButtonProps, 'variant'> {
  variant?: SharedButtonVariant
}

export type { ButtonProps } from 'antd'