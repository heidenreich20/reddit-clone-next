import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UserInfo from '../UserInfo'
import ShowComments from './ShowComments'

export default async function myprofile () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <div className='flex justify-between'>
      <ShowComments session={session} />
      <UserInfo session={session} />
    </div>
  )
}
