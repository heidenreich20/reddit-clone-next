import React from 'react'
import SubmitForm from './SubmitForm'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const page = async () => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', session.user.id)

  return <SubmitForm session={session} profile={profile[0]} />
}

export default page
