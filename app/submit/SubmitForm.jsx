'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CommentCMS from '@/components/CommentCMS'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SubmitForm = ({ profile }) => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [newComment, setNewComment] = useState(null)
  const postTo = searchParams.get('postTo')
  const [newTitle, setNewTitle] = useState('')

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value)
  }

  const createPost = async (value) => {
    if (value.trim() === '') {
      // Handle empty comment input
      return
    }
    try {
      const { error } = await supabase
        .from('posts')
        .upsert([
          {
            body: value,
            author_name: profile.username,
            community_name: postTo,
            author_id: profile.id,
            title: newTitle
          }
        ])
      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
    push('/')
  }

  return (
    <div className='bg-neutral-900 flex flex-col justify-center items-center pt-5'>
      <div className='w-1/3 flex flex-col gap-3'>
        <p className='text-white'>{newTitle}</p>
        <input className='bg-neutral-800 p-2 rounded text-white' onChange={handleTitleChange} type='text' placeholder='Title...' />
        <CommentCMS
          newComment={newComment}
          onCommentChange={(e) => setNewComment(e.target.value)}
          onSubmitComment={createPost}
        />
      </div>
    </div>
  )
}

export default SubmitForm
