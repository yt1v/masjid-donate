import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sabdi Badher Par Jame Masjid | Donation Fund',
  description: 'Support our masjid — donate via Bkash, Nagad, or Bank transfer. Full transparency on funds received and spent.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} h-full antialiased`}>
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
