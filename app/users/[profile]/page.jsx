import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ShowPosts from './posts/ShowPosts'
import UserInfo from './UserInfo'

export default async function profile () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <div className='flex justify-between'>
      <ShowPosts session={session} />
      <UserInfo session={session} />
    </div>
  )
}
