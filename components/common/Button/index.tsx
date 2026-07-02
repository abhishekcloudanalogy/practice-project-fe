'use client'
import { Button as AntButton } from 'antd'
import type { AppButtonProps } from './types'
import { getVariantStyles, getAntdType } from './styles'

export default function Button({ variant = 'primary', style, ...props }: AppButtonProps) {
  const resolvedVariant = typeof variant === 'string' ? variant : 'primary'

  return (
    <AntButton
      {...props}
      type={getAntdType(resolvedVariant)}
      style={{ ...getVariantStyles(resolvedVariant), ...style }}
    />
  )
}

export type { AppButtonProps, AppButtonVariant, ButtonProps } from './types'