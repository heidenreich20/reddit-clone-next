import './globals.css'
import Navbar from '@/components/Navbar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const metadata = {
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
        <meta property='og:image' content='/og-image.PNG' />
        <link rel='shortcut icon' href='favicon.ico' />
      </head>
      <body>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  )
}
