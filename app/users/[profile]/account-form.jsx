'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '@/components/Avatar'
import { useParams } from 'next/navigation'
import Image from 'next/image'
 
export default function AccountForm({ session }) {
  const params = useParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [profileAvatar, setProfileAvatar] = useState(null)
  const user = session?.user
  console.log(params.profile)

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
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      let { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      {session && user?.id === userId ? (
      <>
        <Avatar
        uid={user.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ fullname, username, website, avatar_url: url })
        }}
      />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button primary block"
            onClick={() => updateProfile({ fullname, username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button className="button block" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </>
      ) : (
        <div>
          <p>{fullname ? fullname : 'pepito'}</p>
          <p>{username ? username : 'pepito'}</p>
          <Image width={64} height={64} src={profileAvatar ? profileAvatar : 'https://precisionpharmacy.net/wp-content/themes/apexclinic/images/no-image/No-Image-Found-400x264.png'} />
        </div>
      )
    }
    </div>
  )
}