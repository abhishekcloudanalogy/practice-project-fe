"use client";

import { Modal as AntModalStatic } from 'antd'
import AntModal from '../antd/Modal'
import { StyledModalWrapper } from './styles'
import type { AppModalProps } from './types'

const Modal = ({ children, variant = 'default', zIndex = 1050, ...props }: AppModalProps) => {
	return (
		<StyledModalWrapper $variant={variant}>
			<AntModal zIndex={zIndex} {...props}>{children}</AntModal>
		</StyledModalWrapper>
	)
}

Modal.confirm = AntModalStatic.confirm

export default Modal