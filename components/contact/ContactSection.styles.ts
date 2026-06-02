"use client";

import styled from 'styled-components'

export const ContactPageShell = styled.main`
	flex: 1;
	background:
		linear-gradient(180deg, #f8fafc 0%, #eef4ff 52%, #f8fafc 100%);
	padding: 44px 20px 56px;
`

export const ContactContainer = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
	gap: 24px;
	width: min(1180px, 100%);
	margin: 0 auto;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
`
