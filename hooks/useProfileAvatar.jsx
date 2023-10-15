import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

function useProfileAvatar (url) {
  const noAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OuTLrRxelnXyGeD6KieoxUZW7gyffxCr3_La8Qm8&s'
  const supabase = createClientComponentClient()
  const [profileAvatar, setProfileAvatar] = useState(null)

  useEffect(() => {
    async function downloadImage (path) {
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

    if (url) {
      downloadImage(url)
    }
  }, [url, supabase])

  return { profileAvatar, noAvatar }
}

export default useProfileAvatar
