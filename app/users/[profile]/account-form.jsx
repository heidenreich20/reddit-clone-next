'use client'
import PostCard from '@/components/PostCard'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import SkeletonLoader from '@/components/SkeletonLoader'
import useProfileAvatar from '@/hooks/useProfileAvatar'

export default function AccountForm ({ session }) {
  const [userData, setUserData] = useState(null)
  const { profileAvatar, noAvatar } = useProfileAvatar(userData?.avatar_url)
  const router = useRouter()
  const params = useParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, full_name, username, website, avatar_url, created_at')
        .eq('username', params.profile)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        const { data: fetchedPosts } = await supabase
          .from('posts')
          .select('*')
          .eq('author_name', params.profile)
          .order('created_at', { ascending: false })

        setUserData(data)
        setPosts(fetchedPosts)
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
        .eq('username', params.profile)
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
    <div className='form-widget bg-neutral-700 grid grid-cols-8 h-[100vh]'>
      <ul className='col-span-4 flex flex-col gap-2 p-2 border lg:col-span-6'>
        {posts?.map((post) => (
          <PostCard key={post.post_id} postId={post.post_id} title={post.title} image={post.image} user={post.author_name} community={post.community_name} date={post.created_at} />
        ))}
      </ul>
      <div className='flex flex-col gap-2 bg-neutral-200 h-[94vh] sm:col-start-5 sm:col-span-4 md:col-start-5 md:col-span-4 lg:col-start-7 lg:col-span-2 col-span-8 p-4'>
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
              <p>{userData?.full_name}</p>
            </div>
            )}
        {loading
          ? <SkeletonLoader />
          : (
            <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
              <p>{userData?.username}</p>
            </div>
            )}
      </div>
    </div>
  )
}
