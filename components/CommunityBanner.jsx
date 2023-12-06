import { useState, useEffect } from 'react'
import Image from 'next/image'

const CommunityBanner = ({ banner, supabase, title }) => {
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
      <a href={`/c/${title}`} aria-label='community main page'>
        {communityBanner
          ? (<Image className='w-full absolute object-cover aspect-video' alt='community banner' fill src={communityBanner} />)
          : null}
      </a>
    </div>
  )
}

export default CommunityBanner
