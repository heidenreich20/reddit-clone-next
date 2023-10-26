'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/Avatar'
import SkeletonLoader from '@/components/SkeletonLoader'
import moment from 'moment'
require('moment/locale/es')

const UserInfo = ({ session }) => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const timeSince = moment(createdAt, 'YYYYMMDD').locale('en').fromNow()
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, created_at')
        .eq('id', user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setCreatedAt(data.created_at)
      }
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({ username, website, avatarUrl }) {
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      if (error) throw error
      router.refresh()
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert('Error updating the data!')
    } finally {
      setLoading(false)
      // here I want to redirect the user, changing the users/[id] of the url to the username
    }
  }

  return (
    <div className='flex flex-col w-full sm:w-1/3 gap-2 bg-neutral-200 sm:col-start-5 sm:col-span-4 md:col-start-5 md:col-span-4 lg:col-start-7 lg:col-span-2 col-span-8 p-4'>
      {loading
        ? <SkeletonLoader width='image' />
        : (
          <Avatar
            uid={user.id}
            url={avatarUrl}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ fullname, username, avatarUrl: url })
            }}
          />
        )}
      {loading
        ? <SkeletonLoader />
        : (
          <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
            <label htmlFor='email'>Email</label>
            <input className='rounded-md p-1 w-2/3' id='email' type='text' value={session?.user.email} disabled />
          </div>
        )}
      {loading
        ? <SkeletonLoader />
        : (
          <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
            <label htmlFor='fullName'>Full Name</label>
            <input
              className='rounded-md p-1 w-2/3'
              id='fullName'
              type='text'
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
        )}
      {loading
        ? <SkeletonLoader />
        : (
          <div className='bg-neutral-400/[0.5] items-center justify-between flex p-2 rounded-lg font-semibold text-neutral-700'>
            <label htmlFor='username'>Username</label>
            <input
              className='rounded-md p-1 w-2/3'
              id='username'
              type='text'
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
      <div>
        <div className='flex items-center gap-3'>
          <button
            aria-label='Update profile'
            className='bg-neutral-300/[0.5] p-2 rounded-lg font-semibold text-neutral-700'
            onClick={() => updateProfile({ fullname, username, avatarUrl })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
          <form action='/auth/signout' method='post'>
            <button aria-label='Sign out' className='bg-red-500 p-2 rounded-lg font-semibold text-neutral-100' type='submit'>
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div>Created: {loading ? 'Loading...' : timeSince}</div>
    </div>
  )
}

export default UserInfo
