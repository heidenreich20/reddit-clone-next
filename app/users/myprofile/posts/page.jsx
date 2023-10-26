import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from '../account-form'
import UserInfo from './UserInfo'

export default async function myprofile () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { data: posts } = await supabase
    .from('posts')
    .select()
    .eq('author_id', session.user.id)

  return (
    <div className='flex justify-between'>
      <AccountForm session={session} posts={posts} />
      <UserInfo session={session} />
    </div>
  )
}
