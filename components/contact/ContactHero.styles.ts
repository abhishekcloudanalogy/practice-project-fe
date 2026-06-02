"use client";

import styled from 'styled-components'

export const HeroShell = styled.section`
	display: flex;
	height: 100%;
	min-height: 520px;
	flex-direction: column;
	justify-content: space-between;
	gap: 32px;
	overflow: hidden;
	border-radius: 8px;
	background:
		linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(29, 78, 216, 0.84)),
		url('/authbg.jpeg');
	background-position: center;
	background-size: cover;
	color: #ffffff;
	padding: 40px;
	box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);

	@media (max-width: 1024px) {
		min-height: auto;
		padding: 32px;
	}

	@media (max-width: 640px) {
		padding: 24px;
	}
`

export const HeroBadge = styled.div`
	display: inline-flex;
	width: fit-content;
	align-items: center;
	gap: 8px;
	border: 1px solid rgba(255, 255, 255, 0.28);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.12);
	padding: 8px 12px;
	color: #dbeafe;
	font-size: 13px;
	font-weight: 600;
`

export const HeroTitle = styled.h1`
	margin: 0;
	max-width: 620px;
	color: #ffffff;
	font-size: clamp(2.25rem, 4vw, 4.25rem);
	font-weight: 750;
	letter-spacing: 0;
	line-height: 1.04;
`

export const HeroText = styled.p`
	margin: 18px 0 0;
	max-width: 560px;
	color: #dbeafe;
	font-size: 16px;
	line-height: 1.7;
`

export const InfoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`

export const InfoTile = styled.div`
	border: 1px solid rgba(255, 255, 255, 0.18);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.1);
	padding: 16px;
	backdrop-filter: blur(12px);
`

export const InfoIcon = styled.span`
	display: flex;
	height: 36px;
	width: 36px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.16);
	color: #bfdbfe;
	font-size: 18px;
`

export const InfoLabel = styled.p`
	margin: 12px 0 4px;
	color: #bfdbfe;
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
`

export const InfoValue = styled.p`
	margin: 0;
	color: #ffffff;
	font-size: 14px;
	font-weight: 600;
	line-height: 1.45;
`
