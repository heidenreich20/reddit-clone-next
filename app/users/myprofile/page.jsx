import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from './account-form'

export default async function myprofile() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const { data: posts } = await supabase
    .from("posts")
    .select()
    .eq('author_id', session.user.id)
    
  return <AccountForm session={session} posts={posts} />
}