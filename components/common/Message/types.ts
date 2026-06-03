import type { message } from 'antd'

export type AppMessageApi = typeof message
export type AppMessageConfig = Parameters<typeof message.config>[0]
