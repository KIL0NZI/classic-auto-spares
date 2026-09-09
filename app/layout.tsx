import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { FloatingCart } from '@/components/FloatingCart'
import { WhatsAppButton } from "@/components/whatsapp-button"

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Classic Auto Spares Parts | The right part. The first time.',
  description: 'Browse reliable car spare parts with clear fitment information and expert support.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#202329',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
        <WhatsAppButton />
        <FloatingCart />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
