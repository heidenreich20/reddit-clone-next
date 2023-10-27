import Dashboard from '@/components/Dashboard'
import MainBody from '@/components/MainBody'
import Feed from '@/components/Feed'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <main className='flex justify-center flex-col bg-neutral-800 p-6 gap-2'>
      <Dashboard session={session} />
      <section className='gap-6 flex'>
        <MainBody />
        <Feed />
      </section>
    </main>
  )
}
