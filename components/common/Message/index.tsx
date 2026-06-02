"use client";

import AntMessage from '../antd/Message'
import { StyledMessageGlobal, messageConfig } from './styles'
import type { AppMessageApi } from './types'

AntMessage.config(messageConfig)

export const MessageStyles = StyledMessageGlobal

const Message = AntMessage as AppMessageApi

export default Message
