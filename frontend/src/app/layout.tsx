import { ConfigProvider } from '@/utils/context/config.context'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Votenet',
  description: 'A digital voting app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-200 flex flex-col'}>
        <UserProvider>
          <ConfigProvider>{children}</ConfigProvider>
        </UserProvider>
      </body>
    </html>
  )
}
