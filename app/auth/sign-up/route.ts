import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const confirmPassword = String(formData.get('confirm-password'))
  const supabase = createRouteHandlerClient({ cookies })
  const username = String(formData.get('username'))
  const profile = String(formData.get('profile'))
  
  if (password !== confirmPassword) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up-form?error=Passwords do not match`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    ) 
  } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
          data: {
            username: username,
            avatar_url: profile,
          }
        }
      })
      if (error?.message.includes('duplicate key value violates unique constraint "profiles_username_key"')) {
        console.log(error?.message)
        return NextResponse.redirect(
          `${requestUrl.origin}/sign-up-form?error=Name already taken`,
          {
            // a 301 status is required to redirect from a POST to a GET route
            status: 301,
          }
        )
      }
      if (error) {
        return NextResponse.redirect(
          `${requestUrl.origin}/sign-up-form?error=Could not authenticate user`,
          {
            // a 301 status is required to redirect from a POST to a GET route
            status: 301,
          }
        )
      }
        return NextResponse.redirect(
          `${requestUrl.origin}`,
          {
            // a 301 status is required to redirect from a POST to a GET route
            status: 301,
          }
        )
    
    }
  }

