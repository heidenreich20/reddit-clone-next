'use client'
import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import useProfileAvatar from '@/hooks/useProfileAvatar'

export default function Avatar ({ uid, url, size, onUpload }) {
  const { profileAvatar, noAvatar } = useProfileAvatar(url)
  const supabase = createClientComponentClient()
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {profileAvatar
        ? (
          <div className='flex shadow-md cursor-pointer overflow-hidden shadow-neutral-400 rounded-full w-fit justify-center items-center m-auto relative'>
            <Image
              width={size}
              height={size}
              src={profileAvatar || noAvatar}
              alt='Avatar'
              className='pointer-events-none object-cover object-top aspect-square'
              style={{ height: size, width: size }}
            />
            <label className='absolute rounded-full cursor-pointer w-full h-full' htmlFor='single' />
            <input
              className='hidden rounded-full'
              type='file'
              id='single'
              accept='image/*'
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </div>
          )
        : (
          <div className='flex w-fit justify-center overflow-hidden rounded-full items-center m-auto relative'>
            <Image alt='image placeholder' className='pointer-events-none hover:cursor-pointer aspect-square m-auto object-cover' priority width={144} height={144} src='/noImage.webp' />
            <label className='absolute rounded-full cursor-pointer w-full h-full' htmlFor='single' />
            <input
              className='hidden rounded-full'
              type='file'
              id='single'
              accept='image/*'
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </div>
          )}
    </div>
  )
}
