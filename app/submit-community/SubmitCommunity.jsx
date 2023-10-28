'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SubmitForm = ({ profile }) => {
  const { push } = useRouter()
  const supabase = createClientComponentClient()
  const [communityTitle, setCommunityTitle] = useState(null)
  const [subTitle, setSubTitle] = useState(null)
  const [newFile, setNewFile] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleTitleChange = (e) => {
    setCommunityTitle(e.target.value)
  }

  const handleSubTitleChange = (e) => {
    setSubTitle(e.target.value)
  }

  const createCommunity = async (url) => {
    if (url.trim() === '') {
      // Handle empty comment input
      return
    }
    try {
      const { error } = await supabase
        .from('communities')
        .upsert([
          {
            community_name: communityTitle,
            community_banner: url,
            sub_title: subTitle
          }
        ])
      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
    push(`/${communityTitle}`)
  }
  const uploadCommunityIcon = async () => {
    try {
      setUploading(true)
      const file = newFile
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`
      const { error } = await supabase
        .storage
        .from('community_icons')
        .upload(`${communityTitle}/${filePath}`, newFile, {
          cacheControl: '3600',
          upsert: false
        })
      if (error) {
        console.log(error)
      }
      createCommunity(filePath)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    uploadCommunityIcon(communityTitle)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const imageView = document.querySelector('.imageView')
    setNewFile(event.dataTransfer.files[0])
    const imgLink = URL.createObjectURL(event.dataTransfer.files[0])
    imageView.style.backgroundImage = `url(${imgLink})`
  }

  return (
    <div className='bg-neutral-900 flex flex-col justify-center items-center pt-5'>
      <form onSubmit={handleSubmit} className='w-1/3 flex flex-col gap-3'>
        <p className='text-white'>{communityTitle}</p>
        <input required className='bg-neutral-800 p-2 rounded text-white' onChange={handleTitleChange} type='text' placeholder='Title...' />
        <input className='bg-neutral-800 p-2 rounded text-white' onChange={handleSubTitleChange} type='text' placeholder='Members title...' />
        <input className='bg-neutral-800 p-2 rounded text-white' onChange={handleSubTitleChange} type='text' placeholder='Members title...' />
        <div
          className='h-56 rounded bg-neutral-800 imageView ext-white'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1 className='text-white font-bold'>Drag and Drop Files to Upload</h1>
        </div>
        <button aria-label='Submit community' disabled={uploading} type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default SubmitForm
