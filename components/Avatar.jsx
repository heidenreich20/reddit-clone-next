'use client'
import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = createClientComponentClient()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const noAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OuTLrRxelnXyGeD6KieoxUZW7gyffxCr3_La8Qm8&s'

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <div className='flex shadow-md cursor-pointer overflow-hidden shadow-neutral-400 rounded-full w-fit justify-center items-center m-auto relative'>
          <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="pointer-events-none aspect-square"
          style={{ height: size, width: size }}
          />
          <label className='absolute cursor-pointer w-full h-full' htmlFor="single" />
          <input
            className='hidden'
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      ) : (
        <div className='flex w-fit justify-center overflow-hidden rounded-full items-center m-auto relative'>
          <Image alt='image placeholder' className="pointer-events-none hover:cursor-pointer aspect-square m-auto object-cover" priority={true} width={144} height={144} src='/noImage.webp' />
          <label className='absolute cursor-pointer w-full h-full' htmlFor="single" />
         <input
            className='hidden'
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  )
}