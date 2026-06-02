"use client";

import ContactForm from './ContactForm'
import ContactHero from './ContactHero'
import { ContactContainer, ContactPageShell } from './ContactSection.styles'

const ContactSection = () => {
	return (
		<ContactPageShell>
			<ContactContainer>
				<ContactHero />
				<ContactForm />
			</ContactContainer>
		</ContactPageShell>
	)
}

export default ContactSection
