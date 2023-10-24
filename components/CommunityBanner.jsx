import { useState, useEffect } from 'react'
import Image from 'next/image'

const CommunityBanner = ({ banner, supabase }) => {
  const noImage = 'https://media.istockphoto.com/id/1369150014/vector/breaking-news-with-world-map-background-vector.jpg?s=612x612&w=0&k=20&c=9pR2-nDBhb7cOvvZU_VdgkMmPJXrBQ4rB1AkTXxRIKM='
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
      <Image className='w-full absolute object-cover aspect-video' alt='community banner' fill src={communityBanner || noImage} />
    </div>
  )
}

export default CommunityBanner
