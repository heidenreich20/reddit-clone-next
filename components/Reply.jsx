'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import useProfileAvatar from '@/hooks/useProfileAvatar'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useReplyDeletion from '@/hooks/useReplyDeletion'
import ConfirmPrompt from './ConfirmPrompt'
import CommentCMS from './CommentCMS'
import Reply from '@/components/Reply'

const Comment = ({ avatarUrl, userData, commentId, postId, username, body, supabase, replyId, authorId, reqId }) => {
  const { profileAvatar, noAvatar } = useProfileAvatar(avatarUrl)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [replies, setReplies] = useState()
  const [commentToDelete, setCommentToDelete] = useState(false)
  const { deleteReply } = useReplyDeletion(supabase)

  useEffect(() => {
    const fetchReplies = async () => {
      const { data: replies } = await supabase
        .from('replies')
        .select()
        .eq('reply_to_reply', commentId)
      if (replies) {
        setReplies(replies)
      } else {
        console.log('Something went wrong...')
      }
    }
    fetchReplies()
  }, [])

  const handleReply = async () => {
    setIsReplyOpen(!isReplyOpen)
  }

  const openConfirmPrompt = () => {
    setIsOpen(true)
    setCommentToDelete(replyId)
  }
  const closeConfirmPrompt = () => {
    setIsOpen(false)
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteReply(commentId)
      closeConfirmPrompt()
    } catch (error) {
      console.log(error)
    } finally {
      window.location.reload()
    }
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
            reply_to_reply: commentId,
            post_id: postId
          }
        ])

      if (error) {
        console.error('Error creating comment:', error)
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsReplyOpen(false)
      window.location.reload()
    }
  }

  return (
    <>
      <ConfirmPrompt
        isOpen={isOpen}
        action='Delete'
        onConfirm={handleDelete}
        onClose={closeConfirmPrompt}
        itemId={commentToDelete}
        message='You will permanently delete this comment'
      />
      <div className='p-3 h-fit rounded-lg flex flex-col justify-between'>
        <div className=' text-white text-xl flex flex-col'>
          <div className='flex w-fit items-center h-fit gap-2'>
            <Image className='rounded-full w-8 h-8 object-cover aspect-square' width={42} height={42} src={profileAvatar || noAvatar} alt='profile picture' />
            <p className='text-sm font-semibold'>{username}</p>
          </div>
          <Markdown className='markdown text-sm' remarkPlugins={[remarkGfm]}>{body}</Markdown>
        </div>
        {authorId !== reqId ? (<button onClick={handleReply} className='text-neutral-400 flex text-xs font-bold'>{!isReplyOpen ? 'Reply' : 'Cancel'}</button>) : null}
        {reqId === authorId && (
          <button aria-label='Delete comment' onClick={openConfirmPrompt} className='text-xs flex text-neutral-400 font-bold'>
            Delete
          </button>
        )}
      </div>
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
      <CommentCMS show={isReplyOpen} onSubmitComment={createReply} />
    </>
  )
}

export default Comment
