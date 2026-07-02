'use client'
import { Input as AntInput } from 'antd'
import type { InputProps as AntdInputProps, InputRef } from 'antd'
import { forwardRef } from 'react'

type InputComponent = typeof AntInput & {
  TextArea: typeof TextArea
  Password: typeof AntInput.Password
  Search: typeof AntInput.Search
  Group: typeof AntInput.Group
}

const TextArea = forwardRef<InputRef, React.ComponentProps<typeof AntInput.TextArea>>(function TextArea({ style, ...props }, ref) {
  return (
    <AntInput.TextArea
      {...props}
      ref={ref}
      style={{ borderRadius: 8, borderColor: '#e2e8f0', ...style }}
    />
  )
})

const Input = forwardRef<InputRef, AntdInputProps>(function Input({ style, ...props }, ref) {
  return (
    <AntInput
      {...props}
      ref={ref}
      style={{ borderRadius: 8, borderColor: '#e2e8f0', ...style }}
    />
  )
}) as unknown as InputComponent

Input.TextArea = TextArea as unknown as InputComponent['TextArea']
Input.Password = AntInput.Password as unknown as InputComponent['Password']
Input.Search = AntInput.Search as unknown as InputComponent['Search']
Input.Group = AntInput.Group as unknown as InputComponent['Group']

export default Input
export type { InputProps as AntdInputProps, InputRef } from 'antd'
