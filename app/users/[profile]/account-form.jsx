
'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '@/components/Avatar'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import SkeletonLoader from '@/components/SkeletonLoader'
import { useRouter } from 'next/navigation';

 
export default function AccountForm({ session }) {
  const router = useRouter();
  const params = useParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(null)
  const [fullname, setFullname] = useState(null)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [profileAvatar, setProfileAvatar] = useState(null)
  const user = session?.user

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setProfileAvatar(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (avatar_url) downloadImage(avatar_url)
  }, [avatar_url, supabase])

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id, full_name, username, website, avatar_url`)
        .eq('username', params.profile)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUserId(data.id)
        setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      checkUserProfile();
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function checkUserProfile() {
    try {
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id`)
        .eq('username', params.profile)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (user.id === data.id) {
        // Redirect the user to the correct profile page if the usernames don't match
        router.replace('http://localhost:3000/users/myprofile');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    } finally {
      setLoading(false)
    }
  }
  
  // useEffect(() => {
  //   checkUserProfile();
  // }, [user.id, params.profile, router]);

  return (
    <div className="form-widget grid grid-cols-6">
        <div>
          {loading ? <SkeletonLoader /> : <p className='bg-neutral-200/[0.5] p-2 rounded-lg font-semibold text-neutral-700'>{fullname}</p> }
          {loading ? <SkeletonLoader /> : <p className='bg-neutral-200/[0.5] p-2 rounded-lg font-semibold text-neutral-700'>{username}</p> }
          {loading ? <SkeletonLoader width={'image'} /> : <Image alt='user avatar' className='bg-neutral-200/[0.5] p-2 rounded-lg' width={256} height={256} src={profileAvatar ? profileAvatar : 'https://precisionpharmacy.net/wp-content/themes/apexclinic/images/no-image/No-Image-Found-400x264.png'} /> }
        </div>
    </div>
  )
}


