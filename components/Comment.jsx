'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import useProfileAvatar from '@/hooks/useProfileAvatar'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Reply from '@/components/Reply'
import CommentCMS from './CommentCMS'

const Comment = ({ userData, avatarUrl, username, commentId, body, supabase, postId, createdAt, deleteComment, replyToComment, authorId, reqId }) => {
  const { profileAvatar, noAvatar } = useProfileAvatar(avatarUrl)
  const [isReply, setIsReply] = useState(false)
  const [replies, setReplies] = useState()

  useEffect(() => {
    const fetchReplies = async () => {
      const { data: replies } = await supabase
        .from('replies')
        .select()
        .eq('reply_to_comment', commentId)
      if (replies) {
        setReplies(replies)
      } else {
        console.log('Something went wrong...')
      }
    }
    fetchReplies()
  }, [])

  const handleReply = async () => {
    setIsReply(!isReply)
  }

  const createReply = async (value) => {
    if (value.trim() === '') {
      // Handle empty comment input
      return
    }
    try {
      const { error } = await supabase
        .from('replies')
        .upsert([
          {
            body: value,
            author_username: userData.username,
            avatar_url: userData.avatar_url,
            author_id: userData.id,
            reply_to_comment: commentId,
            post_id: postId
          }
        ])

      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      window.location.reload()
    }
  }

  return (
    <div>
      <div className='p-3 h-fit rounded-lg flex flex-col justify-between'>
        <div className=' text-white text-xl flex flex-col'>
          <div className='flex w-fit items-center h-fit gap-2'>
            <Image className='rounded-full w-8 h-8 object-cover aspect-square' width={42} height={42} src={profileAvatar || noAvatar} alt='profile picture' />
            <p className='text-sm font-semibold'>{username}</p>
          </div>
          <Markdown className='markdown text-sm' remarkPlugins={[remarkGfm]}>{body}</Markdown>
        </div>
        <div className='flex items-center'>
          {authorId !== reqId ? (<button onClick={handleReply} className='text-neutral-400 text-xs font-bold'>{!isReply ? 'Reply' : 'Cancel'}</button>) : null}
          {reqId === authorId && (
            <button aria-label='Delete comment' onClick={deleteComment} className='text-xs flex text-neutral-400 font-bold'>
              Delete
            </button>
          )}
        </div>
      </div>
      <CommentCMS show={isReply} onSubmitComment={createReply} />
      {replies?.map((reply) => {
        return (
          <div key={reply?.id} className='flex'>
            <i className='separator flex mx-4 bg-neutral-500 w-0.5' />
            <div className='flex flex-col w-full'>
              <Reply userData={userData} commentId={reply.id} postId={postId} supabase={supabase} replyId={reply.id} username={reply?.author_username} authorId={reply?.author_id} reqId={reqId} body={reply?.body} avatarUrl={reply?.avatar_url} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Comment
