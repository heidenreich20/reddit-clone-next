import React from 'react'
import Image from 'next/image'
import useProfileAvatar from '@/hooks/useProfileAvatar'

const Comment = ({ avatarUrl, username, body, createdAt }) => {
  const { profileAvatar, noAvatar } = useProfileAvatar(avatarUrl)
  return (
    <div className='bg-neutral-800 p-2 h-24 rounded-lg text-white text-xl flex flex-col'>
      <div className='flex w-fit items-center h-fit gap-2'>
        <Image className='rounded-full w-8 h-8 object-cover aspect-square' width={42} height={42} src={profileAvatar || noAvatar} alt='profile picture' />
        <p className='text-sm font-semibold'>{username}</p>
      </div>
      <p className='ml-10 text-sm'>{body}</p>
    </div>
  )
}

export default Comment
