'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SubSelector = ({ name, url, supabase, isFavorite, user, communityId }) => {
  const [isFavoriteSub, setIsFavoriteSub] = useState(isFavorite)
  const [isUpdating, setIsUpdating] = useState(false)
  const noImage = 'https://media.istockphoto.com/id/1369150014/vector/breaking-news-with-world-map-background-vector.jpg?s=612x612&w=0&k=20&c=9pR2-nDBhb7cOvvZU_VdgkMmPJXrBQ4rB1AkTXxRIKM='
  const [communityIcon, setCommunityIcon] = useState()

  useEffect(() => {
    async function downloadImage (path) {
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

  const addFavorite = async () => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('subbed_communities')
        .update({ is_favorite: !isFavoriteSub })
        .eq('user_id', user.id)
        .eq('community_id', communityId)
      if (error) {
        console.log('error fetching favorite subs' + error)
      }
      setIsFavoriteSub(!isFavoriteSub)
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='flex items-center justify-between my-2 gap-2 px-3'>
      <div className='flex gap-2'>
        <Image alt='community icon' className='w-6 h-6 rounded-full' width={50} height={50} src={communityIcon || noImage} />
        <Link href={`/c/${name}`}>{name}</Link>
      </div>
      <button disabled={isUpdating} onClick={() => { addFavorite() }}>
        <svg className={`${isFavoriteSub ? 'fill-purple-600 stroke-purple-600' : 'fill-transparent w-5 stroke-white'} w-5`} fill='inherit' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' stroke='inherit'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' stroke='inherit' strokeWidth='40'><path d='M476 801l-181 95q-18 10-36.5 4.5T229 879t-7-36l34-202q2-12-1.5-24T242 596L95 453q-15-14-15.5-33.5T91 385t32-18l203-30q12-2 22-9t16-18l90-184q10-18 28-25t36 0 28 25l90 184q6 11 16 18t22 9l203 30q20 3 32 18t11.5 34.5T905 453L758 596q-8 9-12 21t-2 24l34 202q4 20-7 36t-29.5 21.5T705 896l-181-95q-11-6-24-6t-24 6z' /></g><g id='SVGRepo_iconCarrier'><path d='M476 801l-181 95q-18 10-36.5 4.5T229 879t-7-36l34-202q2-12-1.5-24T242 596L95 453q-15-14-15.5-33.5T91 385t32-18l203-30q12-2 22-9t16-18l90-184q10-18 28-25t36 0 28 25l90 184q6 11 16 18t22 9l203 30q20 3 32 18t11.5 34.5T905 453L758 596q-8 9-12 21t-2 24l34 202q4 20-7 36t-29.5 21.5T705 896l-181-95q-11-6-24-6t-24 6z' /></g></svg>
      </button>
    </div>
  )
}

export default SubSelector
