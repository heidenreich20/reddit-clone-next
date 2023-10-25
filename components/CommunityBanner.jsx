import { useState, useEffect } from 'react'
import Image from 'next/image'

const CommunityBanner = ({ banner, supabase }) => {
  const [communityBanner, setCommunityBanner] = useState()
  useEffect(() => {
    async function downloadImage (path) {
      try {
        const { data, error } = await supabase.storage.from('community_icons').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setCommunityBanner(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (banner) downloadImage(banner)
  }, [banner, supabase])

  return (
    <div className='relative w-full h-64'>
      {communityBanner
        ? (<Image className='w-full absolute object-cover aspect-video' alt='community banner' fill src={communityBanner} />)
        : null}
    </div>
  )
}

export default CommunityBanner
