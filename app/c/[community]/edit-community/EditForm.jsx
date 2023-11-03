'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CommunityIcon from '@/components/CommunityIcon'

const EditForm = () => {
  const { community } = useParams()
  const supabase = createClientComponentClient()
  const [communityData, setCommunityData] = useState()
  const [communityTitle, setCommunityTitle] = useState(null)
  const [subTitle, setSubTitle] = useState(null)
  const [communityDescription, setCommunityDescription] = useState(null)
  const [communityBanner, setCommunityBanner] = useState(null)
  const [banner, setBanner] = useState(null)
  const [newIcon, setNewIcon] = useState(null)
  const [newBanner, setNewBanner] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    try {
      const fetchCommunity = async () => {
        const { data, error } = await supabase
          .from('communities')
          .select()
          .eq('community_name', community)
          .single()
        if (data) {
          setCommunityTitle(data.community_name)
          setSubTitle(data.sub_title)
          setCommunityDescription(data.description)
          setBanner(data.community_banner)
          setCommunityData(data)
        } else if (error) {
          console.log(error)
        }
      }
      fetchCommunity()
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleTitleChange = (e) => {
    setCommunityTitle(e.target.value)
  }

  const handleSubTitleChange = (e) => {
    setSubTitle(e.target.value)
  }

  const handleDescription = (e) => {
    setCommunityDescription(e.target.value)
  }

  const updateCommunity = async () => {
    try {
      const { error } = await supabase
        .from('communities')
        .update([
          {
            community_name: communityTitle,
            sub_title: subTitle,
            description: communityDescription
          }
        ])
        .eq('id', communityData.id)
      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
    // push(`/${communityTitle}`)
  }

  const updateIcon = async (url) => {
    if (url?.trim() === '') {
      // Handle empty comment input
      console.log('empty string')
    }
    try {
      const { error } = await supabase
        .from('communities')
        .update([
          {
            community_icon: url
          }
        ])
        .eq('id', communityData.id)
      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const updateBanner = async (url) => {
    if (url?.trim() === '') {
      // Handle empty comment input
      console.log('empty string')
    }
    try {
      const { error } = await supabase
        .from('communities')
        .update([
          {
            community_banner: url
          }
        ])
        .eq('id', communityData.id)
      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  // Function to upload a file to Supabase Storage
  const uploadFile = async (file, folderName) => {
    try {
      if (file) {
        console.log('uploading icon...')
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`
        const { error } = await supabase
          .storage
          .from('community_icons')
          .upload(`${folderName}/${filePath}`, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.log(error)
        }

        return filePath
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const uploadCommunityIcon = async (newIcon) => {
    const url = await uploadFile(newIcon, community)
    if (url) {
      updateIcon(url)
    }
  }

  const uploadCommunityBanner = async (newBanner) => {
    const url = await uploadFile(newBanner, community)
    if (url) {
      updateBanner(url)
    }
  }

  // const handleTest = async (e) => {
  //   e.preventDefault()
  //   console.log('testin testing')
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    await uploadCommunityIcon(newIcon)
    await uploadCommunityBanner(newBanner)
    await updateCommunity()
    setUploading(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setNewBanner(e.dataTransfer.files[0])
    const imgLink = URL.createObjectURL(e.dataTransfer.files[0])
    setCommunityBanner(imgLink)
  }

  const handleIconUpload = (e) => {
    e.preventDefault()
    setNewIcon(e.target.files[0])
  }

  useEffect(() => {
    async function downloadImage (path) {
      try {
        const { data, error } = await supabase.storage.from(`community_icons/${community}`).download(path)
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
    <div className='bg-neutral-700 py-4 flex flex-col items-center'>
      {communityData
        ? (
          <>
            <form onSubmit={handleSubmit} className='flex flex-col w-1/2 gap-5'>
              <div className='flex gap-5'>
                <div className='flex flex-col w-1/2 gap-5'>
                  <div className='items-center flex gap-5'>
                    <div className='flex relative'>
                      <CommunityIcon supabase={supabase} subtitle={communityData?.subtitle} url={`${communityData?.community_name}/${communityData?.community_icon}`} />
                    </div>
                    <label className='absolute rounded-full cursor-pointer w-24 h-24' htmlFor='icon' />
                    <input id='icon' className='hidden' type='file' onChange={handleIconUpload} />
                    <div className='flex flex-col w-3/4 gap-2 h-full justify-between'>
                      <input value={communityTitle} className='bg-neutral-800 p-2 rounded text-white' onChange={handleTitleChange} type='text' placeholder='Title...' />
                      <input value={subTitle} className='bg-neutral-800 p-2 rounded text-white' onChange={handleSubTitleChange} type='text' placeholder='Members title...' />
                    </div>
                  </div>
                  <div
                    className='drag-area flex items-center justify-center h-56 relative rounded-lg bg-neutral-800 text-white'
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <h1 className='dnd-text text-neutral-300 bg-purple-700/[0.3] p-2 rounded-lg z-20 text-center font-bold'>Drag and Drop Files to Upload</h1>
                    <img src={communityBanner} className='flex rounded object-cover h-full w-full absolute' alt='community banner' />
                  </div>
                </div>
                <div className='w-1/2 rounded'>
                  <textarea value={communityDescription} onChange={handleDescription} className='rounded p-2 resize-none w-full h-full bg-neutral-800 text-neutral-200' name='community-description' cols='30' rows='10' />
                </div>
              </div>
              <button className='bg-purple-800 justify-center flex m-auto text-white font-semibold w-24 p-2 rounded-lg' aria-label='Submit community' disabled={uploading} type='submit'>
                {uploading ? <span className='loader w-6 h-6 m-auto' /> : 'Confirm'}
              </button>
            </form>
          </>
          )
        : (null)}
    </div>
  )
}

export default EditForm
