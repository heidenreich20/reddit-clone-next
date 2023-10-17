import React from 'react'
import Image from 'next/image'
import useProfileAvatar from '@/hooks/useProfileAvatar'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Comment = ({ avatarUrl, username, body, createdAt, deleteComment, authorId, reqId }) => {
  const { profileAvatar, noAvatar } = useProfileAvatar(avatarUrl)

  return (
    <div className='bg-neutral-800 p-2 h-fit rounded-lg flex flex-col justify-between'>
      <div className=' text-white text-xl flex flex-col'>
        <div className='flex w-fit items-center h-fit gap-2'>
          <Image className='rounded-full w-8 h-8 object-cover aspect-square' width={42} height={42} src={profileAvatar || noAvatar} alt='profile picture' />
          <p className='text-sm font-semibold'>{username}</p>
        </div>
        <Markdown className='markdown text-sm' remarkPlugins={[remarkGfm]}>{body}</Markdown>
      </div>
      {reqId === authorId && (
        <button onClick={deleteComment} className='text-xs p-2 flex text-neutral-400 font-bold'>
          Delete
        </button>
      )}
    </div>
  )
}

export default Comment
