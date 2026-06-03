"use client";

import { createGlobalStyle } from 'styled-components'
import type { AppMessageConfig } from './types'

export const messageConfig: AppMessageConfig = {
	duration: 3,
	maxCount: 3,
	top: 88,
}

export const StyledMessageGlobal = createGlobalStyle`
	.ant-message {
		z-index: 1060;
		font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
	}

	.ant-message .ant-message-notice-wrapper {
		padding: 0 16px;
	}

	.ant-message .ant-message-notice-content {
		border: 1px solid rgba(148, 163, 184, 0.26);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 18px 48px rgba(15, 23, 42, 0.16);
		color: #0f172a;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.45;
		padding: 12px 16px;
		backdrop-filter: blur(10px);
	}

	.ant-message .ant-message-custom-content {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.ant-message .anticon {
		font-size: 16px;
	}

	.ant-message .ant-message-success .anticon {
		color: #16a34a;
	}

	.ant-message .ant-message-error .anticon {
		color: #dc2626;
	}

	.ant-message .ant-message-warning .anticon {
		color: #d97706;
	}

	.ant-message .ant-message-info .anticon,
	.ant-message .ant-message-loading .anticon {
		color: #2563eb;
	}
`
