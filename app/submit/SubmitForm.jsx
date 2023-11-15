'use client'
import { Toaster, toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CommentCMS from '@/components/CommentCMS'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SubmitForm = ({ profile }) => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [newComment, setNewComment] = useState('')
  const postTo = searchParams.get('postTo')
  const [newTitle, setNewTitle] = useState('')

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value)
  }

  const fetchLatestPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('post_id')
      .eq('author_name', profile.username)
      .order('created_at', { ascending: false }) // Replace 'timestamp_column' with the actual timestamp field in your 'posts' table
      .limit(1)
    if (error) {
      console.error('Error fetching latest post:', error)
      return null // Return null or handle the error accordingly
    }
    if (data && data.length > 0) {
      const latestPost = data[0]
      const url = (`/c/${postTo}/${latestPost.post_id}`)
      push(url)
    }
    return null // Return null if there are no posts for the author
  }

  const createPost = async (value) => {
    if (value.trim() === '' || newTitle === '') {
      // Handle empty comment input
      toast.error('Must have content and a title')
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
    } finally {
      toast.success('Post created!', {
        actionButtonStyle: { backgroundColor: '#4BB543', padding: '1rem' },
        action: {
          label: 'See your post',
          onClick: () => fetchLatestPost()
        }
      })
    }
  }

  return (
    <div className='bg-neutral-800 flex flex-col justify-center items-center pt-5'>
      <Toaster richColors />
      <div className='w-1/3 flex flex-col gap-3'>
        <input aria-label='Comment title' className='bg-neutral-800 p-2 rounded text-white' onChange={handleTitleChange} type='text' placeholder='Title...' />
        <CommentCMS
          show
          newComment={newComment}
          onCommentChange={(e) => setNewComment(e.target.value)}
          onSubmitComment={createPost}
        />
      </div>
    </div>
  )
}

export default SubmitForm
