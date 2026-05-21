
import Image from 'next/image';
import Card from '@/components/common/Card'
import ConfigProvider from '@/components/common/ConfigProvider'
import type { AuthMode } from '@/types/auth.types'
import LoginForm from '@/components/auth/LoginForm';
import { authTheme } from '@/components/common/antd/theme'


type AuthPanelProps = {
    mode: AuthMode
}

const AuthPanel = ({ mode }: AuthPanelProps) => {
    return (
        <ConfigProvider theme={authTheme}>
            <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_34%),linear-gradient(135deg,#f5f3ff_0%,#fafafa_45%,#ede9fe_100%)] px-4 py-6 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <Image src="/authbg.jpeg" alt="" fill priority quality={100} className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(248,245,255,0.72))]" />
                </div>
                <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
                    <Card
                        variant="borderless"
                        className="w-full overflow-hidden border border-[#1e3a8a] bg-white/92 shadow-[0_24px_70px_rgba(76,29,149,0.16)]"
                        styles={{ body: { padding: 0 } }}
                    >
                        <div className="grid min-h-[min(760px,calc(100vh-4rem))] lg:grid-cols-[0.92fr_1.08fr]">
                            <div className="relative hidden min-h-72 overflow-hidden bg-[linear-gradient(160deg,#2e1065_0%,#6d28d9_52%,#a855f7_100%)] lg:block">
                                <Image
                                    src="/authleftimage.jpeg"
                                    alt=""
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.08),transparent_20%)]" aria-hidden="true" />
                                <div className="absolute inset-0 border-r border-white/10" aria-hidden="true" />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,9,45,0.12),rgba(46,16,101,0.38))]" />
                                <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-sm">
                                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">Secure access</p>
                                    <p className="mt-3 max-w-md text-2xl font-semibold leading-tight lg:text-[2rem]">
                                        Clean authentication surfaces for modern teams.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-8 lg:py-10">
                                <div className="w-full max-w-130">
                                    <LoginForm mode={mode} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>



            </main>
        </ConfigProvider>
    )
}

export default AuthPanel