'use client'
import { Tag as AntTag } from 'antd'
import type { TagProps as AntdTagProps } from 'antd'

export type TagVariant = 'default' | 'purple' | 'slate' | 'green' | 'red'

interface Props extends Omit<AntdTagProps, 'variant'> {
  variant?: TagVariant | NonNullable<AntdTagProps['variant']>
}

const variantStyles: Record<TagVariant, React.CSSProperties> = {
  default: {},
  purple: { background: '#ede9fe', color: '#7c3aed', border: 'none' },
  slate:  { background: '#f1f5f9', color: '#64748b', border: 'none' },
  green:  { background: '#f0fdf4', color: '#16a34a', border: 'none' },
  red:    { background: '#fff1f2', color: '#ef4444', border: 'none' },
}

export default function Tag({ variant = 'default', style, ...props }: Props) {
  const resolvedVariant = typeof variant === 'string' && variant in variantStyles ? variant : 'default'

  return (
    <AntTag
      {...props}
      style={{ borderRadius: 6, fontSize: 11, fontWeight: 500, ...variantStyles[resolvedVariant as TagVariant], ...style }}
    />
  )
}

export type { TagProps as AntdTagProps } from 'antd'
