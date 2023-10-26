import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ShowComments from './ShowComments'
import UserInfo from '../posts/UserInfo'

export default async function myprofile () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { data: comments } = await supabase
    .from('comments')
    .select()
    .eq('author_id', session.user.id)

  return (
    <div className='flex bg-neutral-700 justify-between'>
      <ShowComments session={session} comments={comments} />
      <UserInfo session={session} />
    </div>
  )
}
