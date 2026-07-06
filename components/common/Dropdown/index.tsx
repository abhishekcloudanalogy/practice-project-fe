"use client";

import React from 'react'
import AntDropdown from '../antd/Dropdown'
import type { MenuProps } from 'antd'
import { StyledDropdownWrapper } from './styles'
import type { AppDropdownProps } from './types'

type DropdownTrigger = NonNullable<AppDropdownProps['trigger']>

const DEFAULT_TRIGGER: DropdownTrigger = ['hover']

const Dropdown = ({ menuItems, trigger = DEFAULT_TRIGGER, placement = 'bottomRight', children }: AppDropdownProps) => {
  const normalizedTrigger: DropdownTrigger =
    trigger.includes('hover') && !trigger.includes('click')
      ? ['hover', 'click']
      : trigger

  return (
    <StyledDropdownWrapper>
      <AntDropdown menu={{ items: menuItems as MenuProps['items'] }} trigger={normalizedTrigger} placement={placement}>
        {children}
      </AntDropdown>
    </StyledDropdownWrapper>
  )
}

export default Dropdown
