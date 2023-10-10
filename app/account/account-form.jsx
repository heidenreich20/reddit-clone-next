'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '@/components/Avatar'
export default function AccountForm({ session }) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const user = session?.user
  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setFullname(data.full_name)
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({ username, avatar_url }) {
    console.log(avatar_url)
    try {
      setLoading(true)
      let { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url,
          full_name: fullname,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAvatar = async () => {
    try {
      setLoading(true);

      // Replace 'new-avatar-url' with the URL you want to set
      const newAvatarUrl = 'https://hips.hearstapps.com/hmg-prod/images/index-avatar-1665421955.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=1200:*';

      // Update the 'avatar_url' for the user in the 'profiles' table
      const { error } = await supabase.from('profiles').upsert([
        {
          id: user.id,
          avatar_url: newAvatarUrl,
        },
      ]);

      if (error) {
        throw error;
      }

      alert('Avatar updated successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-widget">
            <button onClick={handleUpdateAvatar} disabled={loading}>
        Update Avatar
      </button>
      <Avatar
      uid={user.id}
      url={avatar_url}
      size={144}
      onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ username, avatar_url: url })
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
          onClick={() => updateProfile({ username, avatar_url })}
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
    </div>
  )
}