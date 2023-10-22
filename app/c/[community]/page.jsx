import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import CommunityPosts from './CommunityPosts'

export default async function myprofile () {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <div className='bg-neutral-800'>
      <CommunityPosts session={session} />
    </div>
  )
}
