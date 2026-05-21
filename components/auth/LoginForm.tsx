'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/Button'
import Checkbox from '@/components/common/Checkbox'
import Divider from '@/components/common/Divider'
import Form from '@/components/common/Form'
import Input from '@/components/common/Input'
import Typography from '@/components/common/Typography'
import {
	EyeInvisibleOutlined,
	EyeOutlined,
	LockOutlined,
	MailOutlined,
} from '@/components/common/antd/icons'
import type { AuthMode } from '@/types/auth.types'

type LoginFormValues = {
	email: string
	password: string
	remember: boolean
}

type LoginFormProps = {
	mode: AuthMode
}
const LoginForm = ({ mode }: LoginFormProps) => {

	const [form] = Form.useForm<LoginFormValues>()
	const [loading, setLoading] = useState(false)
	const isSignup = mode === 'signup'

	const handleSubmit = async () => {
		setLoading(true)

		await new Promise((resolve) => {
			window.setTimeout(resolve, 1200)
		})

		setLoading(false)
	}

	return (
		<div className="w-full space-y-8 text-slate-900">
			<div className="space-y-3 text-center lg:text-left">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#7c3aed,#d946ef)] text-white shadow-[0_12px_28px_rgba(124,58,237,0.34)] lg:mx-0"><LockOutlined className="text-xl" /></div>

				<div className="space-y-2">
					<Typography.Title level={2} className="mb-0! text-[2rem]! font-semibold! text-slate-900! sm:text-[2.2rem]!" >{isSignup ? 'Create your account' : 'Welcome back'}</Typography.Title>
					<Typography.Text className="block  text-[15px] leading-6 text-slate-500 sm:text-[16px]">{isSignup
						? 'Create a secure account to get started.'
						: 'Sign in to continue to your secure workspace.'}</Typography.Text>
				</div>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				<Button variant='auth' className='h-12 w-full text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5' size="large">
					<span className='inline-flex items-center justify-center gap-3'>
						<Image src="/googlelogo.svg" alt="Google" width={18} height={18} priority />
						<span>Continue with Google</span>
					</span>
				</Button>
				<Button variant="auth" className="h-12 w-full text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5" size="large">
					<span className="inline-flex items-center justify-center gap-3">
						<Image src="/mslogo.svg" alt="Microsoft" width={18} height={18} priority />
						<span>Continue with Microsoft</span>
					</span>
				</Button>
			</div>

			<Divider className="font-normal! text-slate-500">
				OR
			</Divider>


			<Form <LoginFormValues>
				form={form}
				layout="vertical"
				requiredMark={false}
				onFinish={handleSubmit}
				initialValues={{ remember: true }}
				className="w-full"
			>

				<div className="space-y-5">
					<Form.Item
						label={<span className="text-[15px] font-medium text-slate-700">Email address</span>}
						name="email"
						rules={[
							{ required: true, message: 'Please enter your email address.' },
							{ type: 'email', message: 'Enter a valid email address.' },
						]}
						validateTrigger="onBlur"
						className="mb-0!"
					>
						<Input
							appearance="soft"
							prefix={<MailOutlined className="text-slate-400" />}
							placeholder="Enter your email address"
							size="large"
							className="h-13 rounded-2xl px-4 text-[15px] transition-all duration-300"

						/>
					</Form.Item>

					<Form.Item
						label={<span className="text-[15px] font-medium text-slate-700">Password</span>}
						name="password"
						rules={[
							{ required: true, message: 'Please enter your password.' },
							{ min: 8, message: 'Password must be at least 8 characters long.' },
						]}
						validateTrigger="onBlur"
						className="mb-0!"
					>
						<Input.Password
							appearance="soft"
							prefix={<LockOutlined className="text-slate-400" />}
							placeholder="Enter your password"
							size="large"
							iconRender={(visible) =>
								visible ? (
									<EyeOutlined className="text-slate-400" />
								) : (
									<EyeInvisibleOutlined className="text-slate-400" />
								)
							}
							className="h-13 rounded-2xl px-4 text-[15px] transition-all duration-300"
						/>
					</Form.Item>

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

						<Form.Item name="remember" valuePropName="checked" className="mb-0">
							<Checkbox className="text-[14px] text-slate-600">Remember me</Checkbox>
						</Form.Item>

						<Link href="#" className="text-[14px] font-medium text-violet-600 transition-colors hover:text-violet-500">
							Forgot password?
						</Link>
					</div>


					<Button
						variant="signin"
						type="primary"
						htmlType="submit"
						loading={loading}
						className="h-12 w-full text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5"
					>
						{isSignup ? 'Create account' : 'Sign in'}
					</Button>
				</div>
			</Form>

			<div className="text-center">
				<Typography.Text className="text-[15px] text-slate-500">
					{isSignup ? 'Already have an account? ' : "Don't have an account? "}
					<Link href={isSignup ? '/login' : '/signup'} className="font-semibold text-violet-600 transition-colors hover:text-violet-500">
						{isSignup ? 'Sign in' : 'Sign up'}
					</Link>
				</Typography.Text>
			</div>




		</div>

	)

}

export default LoginForm