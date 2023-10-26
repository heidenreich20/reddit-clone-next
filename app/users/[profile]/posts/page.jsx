import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UserInfo from '../UserInfo'
import ShowPosts from './ShowPosts'

export default async function myprofile () {
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
