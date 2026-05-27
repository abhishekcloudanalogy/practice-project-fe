"use client";

import Link from 'next/link'
import styled from 'styled-components'

export const SidebarShell = styled.aside<{ $collapsed: boolean }>`
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 30;
	height: 100vh;
	overflow-y: auto;
	width: ${({ $collapsed }) => ($collapsed ? '92px' : '288px')};
	flex-shrink: 0;
	flex-direction: column;
	border-right: 1px solid rgba(148, 163, 184, 0.2);
	background:
		linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.94) 100%),
		radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 45%);
	box-shadow: 12px 0 40px rgba(15, 23, 42, 0.16);
	transition: width 0.22s ease;
`

export const SidebarHeader = styled.div<{ $collapsed: boolean }>`
	display: flex;
	align-items: center;
	justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
	gap: 12px;
	padding: 20px ${({ $collapsed }) => ($collapsed ? '0' : '18px')} 16px;
`

export const BrandBlock = styled.div<{ $collapsed: boolean }>`
	display: flex;
	min-width: 0;
	align-items: center;
	gap: ${({ $collapsed }) => ($collapsed ? '0px' : '12px')};
`

export const BrandMark = styled.div`
	display: grid;
	height: 44px;
	width: 44px;
	place-items: center;
	border-radius: 14px;
	background: linear-gradient(180deg, #60a5fa 0%, #1d4ed8 100%);
	font-size: 0.85rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	color: #eff6ff;
	box-shadow: 0 16px 30px rgba(37, 99, 235, 0.28);
`

export const BrandCopy = styled.div`
	display: flex;
	min-width: 0;
	flex-direction: column;
`

export const BrandTitle = styled.div`
	font-size: 0.98rem;
	font-weight: 700;
	color: #f8fafc;
`

export const BrandSubtitle = styled.div`
	font-size: 0.78rem;
	color: #94a3b8;
`

export const ToggleButton = styled.button`
	display: inline-flex;
	height: 40px;
	width: 40px;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	border: 1px solid rgba(148, 163, 184, 0.22);
	border-radius: 9999px;
	background: rgba(15, 23, 42, 0.7);
	color: #e2e8f0;
	transition:
		transform 0.2s ease,
		background 0.2s ease,
		border-color 0.2s ease;

	&:hover {
		transform: translateY(-1px);
		border-color: rgba(96, 165, 250, 0.45);
		background: rgba(30, 41, 59, 0.88);
	}

	@media (max-width: 768px) {
		margin-inline: auto;
	}
`

export const SidebarNav = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 10px;
	padding: 4px 14px 20px;
`

const commonItemStyles = `
	display: flex;
	width: 100%;
	align-items: center;
	gap: 14px;
	border: 1px solid transparent;
	border-radius: 16px;
	padding: 14px 16px;
	text-align: left;
	transition:
		transform 0.18s ease,
		background 0.18s ease,
		border-color 0.18s ease,
		color 0.18s ease;

	&:hover {
		transform: translateX(2px);
	}
`

export const SidebarLink = styled(Link)<{ $collapsed: boolean; $active: boolean }>`
	${commonItemStyles}
	justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
	padding-inline: ${({ $collapsed }) => ($collapsed ? '0' : '16px')};
	gap: ${({ $collapsed }) => ($collapsed ? '0' : '14px')};
	text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'left')};
	background: ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.16)' : 'rgba(15, 23, 42, 0.22)')};
	border-color: ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.4)' : 'rgba(148, 163, 184, 0.12)')};
	color: ${({ $active }) => ($active ? '#eff6ff' : '#cbd5e1')};
	box-shadow: ${({ $active }) => ($active ? '0 14px 30px rgba(37, 99, 235, 0.18)' : 'none')};

	&:hover {
		color: #ffffff;
		background: rgba(96, 165, 250, 0.18);
		border-color: rgba(96, 165, 250, 0.36);
	}
`

export const SidebarButton = styled.button<{ $collapsed: boolean; $active: boolean }>`
	${commonItemStyles}
	justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
	padding-inline: ${({ $collapsed }) => ($collapsed ? '0' : '16px')};
	gap: ${({ $collapsed }) => ($collapsed ? '0' : '14px')};
	text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'left')};
	background: ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.16)' : 'rgba(15, 23, 42, 0.22)')};
	border-color: ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.4)' : 'rgba(148, 163, 184, 0.12)')};
	color: ${({ $active }) => ($active ? '#eff6ff' : '#cbd5e1')};
	box-shadow: ${({ $active }) => ($active ? '0 14px 30px rgba(37, 99, 235, 0.18)' : 'none')};

	&:hover {
		color: #ffffff;
		background: rgba(96, 165, 250, 0.18);
		border-color: rgba(96, 165, 250, 0.36);
	}
`

export const ItemIcon = styled.span`
	display: inline-flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	font-size: 1.05rem;
`

export const ItemLabel = styled.span`
	font-size: 0.95rem;
	font-weight: 600;
	letter-spacing: 0.01em;
`