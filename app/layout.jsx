'use client'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const metadata = {
  metadataBase: new URL('https://reddit-next.vercel.app/'),
  title: 'Reddit Clone Project',
  description: 'A Reddit clone made for educational purposes only',
  openGraph: {
    title: 'Reddit Clone Project',
    description: 'A Reddit clone made for educational purposes only',
    images: [
      {
        url: '/og-image.PNG',
        width: 800,
        height: 600
      }
    ]
  },
  twitter: {
    title: 'Reddit Clone Project',
    description: 'A Reddit clone made for educational purposes only',
    images: {
      url: '/og-image.PNG',
      alt: 'Website image'
    }
  }
}

export default async function RootLayout ({ children }) {
  const supabase = createClientComponentClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html lang='en'>
      <head>
        <link rel='shortcut icon' href='favicon.ico' />
      </head>
      <body>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  )
}
