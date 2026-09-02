import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import { FitmentProvider } from '@/context/FitmentContext'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { FloatingGarage } from '@/components/FloatingGarage'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Classic Auto Spares Parts | The right part. The first time.',
  description: 'Browse reliable car spare parts with clear fitment information and expert support.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#202329',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <FitmentProvider>
          {children}
          <FloatingGarage />
        </FitmentProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
