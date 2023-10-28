'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const CommunityIcon = ({ title, subtitle, url, supabase }) => {
  const noImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OuTLrRxelnXyGeD6KieoxUZW7gyffxCr3_La8Qm8&s'
  const [communityIcon, setCommunityIcon] = useState()

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('community_icons').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setCommunityIcon(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  return (
    <div className='flex sm:flex-row flex-col gap-3 items-center'>
      <Image className='rounded-full w-24 object-cover aspect-square border-2 border-white' alt='community icon' width={72} height={72} src={communityIcon || noImage} />
      <div className='flex flex-col gap-2'>
        <h1 className='md:text-3xl sm:text-lg text-sm font-semibold text-white'>{subtitle}</h1>
        {title ? (<p className='font-bold text-sm text-neutral-400'>{`c/${title}`}</p>) : null}
      </div>
    </div>
  )
}

export default CommunityIcon
