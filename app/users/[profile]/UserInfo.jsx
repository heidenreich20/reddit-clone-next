'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import SkeletonLoader from '@/components/SkeletonLoader'
import useProfileAvatar from '@/hooks/useProfileAvatar'

const UserInfo = ({ session }) => {
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  const params = useParams()
  const decodedUsername = decodeURIComponent(params?.profile)
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const { profileAvatar, noAvatar } = useProfileAvatar(userData?.avatar_url)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, full_name, username, website, avatar_url, created_at, voted_posts')
        .eq('username', decodedUsername)
        .single()
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        setUserData(data)
      }
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert('Error loading user data!')
    } finally {
      checkUserProfile()
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function checkUserProfile () {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', decodedUsername)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (user.id === data.id) {
        // Redirect the user to the correct profile page if the usernames don't match
        router.replace('http://localhost:3000/users/myprofile')
      }
    } catch (error) {
      console.error('Error checking user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col w-full sm:w-1/3 gap-2 bg-neutral-200 sm:col-start-5 sm:col-span-4 md:col-start-5 md:col-span-4 lg:col-start-7 lg:col-span-2 col-span-8 p-4'>
      {loading
        ? <SkeletonLoader width='image' />
        : (
          <div className='rounded-full overflow-hidden'>
            <Image alt='image placeholder' className='pointer-events-none mx-auto hover:cursor-pointer rounded-full aspect-square object-cover' priority width={144} height={144} src={profileAvatar || noAvatar} />
          </div>
          )}
      {loading
        ? <SkeletonLoader />
        : (
          <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
            <p>{userData.full_name}</p>
          </div>
          )}
      {loading
        ? <SkeletonLoader />
        : (
          <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
            <p>{userData.username}</p>
          </div>
          )}
    </div>
  )
}

export default UserInfo
