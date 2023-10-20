'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '@/components/Avatar'
import { useRouter } from 'next/navigation'
import SkeletonLoader from '@/components/SkeletonLoader'
import PostCard from '@/components/PostCard'
import moment from 'moment'
require('moment/locale/es')

export default function AccountForm ({ session, posts }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
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

  async function updateProfile ({ username, website, avatarUrl }) {
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

  const timeSince = moment(createdAt, 'YYYYMMDD').fromNow()
  return (
    <div className='form-widget grid grid-cols-8 bg-neutral-700'>
      <ul className='col-span-4 p-4 flex flex-col gap-2 lg:col-span-6'>
        {posts?.map((post) => (
          <PostCard key={post.post_id} session={session} route={`/c/${post.community_name}/${post.post_id}`} postId={post.post_id} title={post.title} image={post.image} user={post.author_name} community={post.community_name} date={post.created_at} upvotes={post.upvotes} downvotes={post.downvotes} />
        ))}
      </ul>
      <div className='flex flex-col gap-2 bg-neutral-200 sm:col-start-5 sm:col-span-4 md:col-start-5 md:col-span-4 lg:col-start-7 lg:col-span-2 col-span-8 p-4'>
        {loading
          ? <SkeletonLoader width='image' />
          : (
            <Avatar
              uid={user.id}
              url={avatarUrl}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ fullname, username, website, avatarUrl: url })
              }}
            />
            )}
        {loading
          ? <SkeletonLoader />
          : (
            <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
              <label htmlFor='email'>Email</label>
              <input className='rounded-md p-1' id='email' type='text' value={session?.user.email} disabled />
            </div>
            )}
        {loading
          ? <SkeletonLoader />
          : (
            <div className='bg-neutral-400/[0.5] items-center justify-between flex w-full p-2 rounded-lg font-semibold text-neutral-700'>
              <label htmlFor='fullName'>Full Name</label>
              <input
                className='rounded-md p-1'
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
                className='rounded-md p-1'
                id='username'
                type='text'
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            )}
        {loading
          ? <SkeletonLoader />
          : (
            <div className='bg-neutral-400/[0.5] items-center justify-between flex p-2 rounded-lg font-semibold text-neutral-700'>
              <label htmlFor='website'>Website</label>
              <input
                className='rounded-md p-1'
                id='website'
                type='url'
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            )}
        {loading
          ? <SkeletonLoader />
          : (
            <div>
              <div className='flex items-center gap-3'>
                <button
                  className='bg-neutral-300/[0.5] p-2 rounded-lg font-semibold text-neutral-700'
                  onClick={() => updateProfile({ fullname, username, website, avatarUrl })}
                  disabled={loading}
                >
                  {loading ? 'Loading ...' : 'Update'}
                </button>
                <form action='/auth/signout' method='post'>
                  <button className='bg-red-500 p-2 rounded-lg font-semibold text-neutral-100' type='submit'>
                    Sign out
                  </button>
                </form>
              </div>
            </div>
            )}
        <div>Creado: {loading ? 'Cargando...' : timeSince}</div>
      </div>
    </div>
  )
}
