import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyledComponentsRegistry from "@/components/common/StyledComponentsRegistry";
import "./globals.css";
import NavbarGuard from "@/components/layout/NavbarGuard";
import Providers from "@/components/common/Providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "CloudAnalogy Inventory Management",
    template: "%s | CloudAnalogy",
  },
  description:
    "CloudAnalogy is an intelligent inventory management platform — manage products, stock levels, suppliers, and more in one place.",
  keywords: ["inventory management", "product management", "stock levels", "suppliers", "business tool"],
  authors: [{ name: "CloudAnalogy" }],
  creator: "CloudAnalogy",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "CloudAnalogy",
    title: "CloudAnalogy | Inventory Management Platform",
    description: "Intelligent inventory management platform.",
    locale: "en_US",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <StyledComponentsRegistry>
            <Providers>
              <NavbarGuard>{children}</NavbarGuard>
            </Providers>
          </StyledComponentsRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}