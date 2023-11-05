import './globals.css'
import Navbar from '@/components/Navbar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { karla } from './fonts'

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
        width: 1200,
        height: 630
      }
    ]
  }
}

export default async function RootLayout ({ children }) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html lang='en'>
      <head>
        <link rel='canonical' href='https://reddit-next.vercel.app/' />
        <link rel='shortcut icon' href='favicon.ico' />
      </head>
      <body className={`${karla.className}`}>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  )
}
