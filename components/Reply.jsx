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
import moment from 'moment'

const Comment = ({ avatarUrl, userData, commentId, postId, createdAt, username, body, supabase, replyId, authorId, reqId }) => {
  const { profileAvatar, noAvatar } = useProfileAvatar(avatarUrl)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [replies, setReplies] = useState()
  const [isCommentExpanded, setIsCommentExpanded] = useState(true)
  const [commentToDelete, setCommentToDelete] = useState(false)
  const { deleteReply } = useReplyDeletion(supabase)

  const timeSince = moment(createdAt, 'YYYYMMDD').locale('en').fromNow()

  const handleCommentExpanded = () => {
    setIsCommentExpanded(!isCommentExpanded)
  }

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
    <div>
      <ConfirmPrompt
        isOpen={isOpen}
        action='Delete'
        onConfirm={handleDelete}
        onClose={closeConfirmPrompt}
        itemId={commentToDelete}
        message='You will permanently delete this comment'
      />
      <div className='h-fit bg-neutral-800 my-1 rounded-lg flex flex-col justify-between'>
        <div className='p-2 rounded-lg text-white text-xl flex flex-col'>
          <div className='flex w-full items-center h-fit gap-2'>
            <Image className='rounded-full w-8 h-8 object-cover aspect-square' width={42} height={42} src={profileAvatar || noAvatar} alt='profile picture' />
            <p className='text-sm font-semibold'>{username}</p>
            <p className='text-xs text-neutral-400 ml-auto'>{timeSince}</p>
          </div>
          <Markdown className='markdown text-sm' remarkPlugins={[remarkGfm]}>{body}</Markdown>
          {authorId !== reqId ? (<button onClick={handleReply} className='text-neutral-400 flex text-xs font-bold'>{!isReplyOpen ? 'Reply' : 'Cancel'}</button>) : null}
          {reqId === authorId && (
            <button aria-label='Delete comment' onClick={openConfirmPrompt} className='text-xs flex text-neutral-400 font-bold'>
              Delete
            </button>
          )}
        </div>
      </div>
      {isCommentExpanded
        ? (
          <>
            {replies?.map((reply) => {
              return (
                <div key={reply?.id} className='flex'>
                  <button className='separator flex mx-[15px] bg-neutral-500 w-0.5' onClick={handleCommentExpanded} />
                  <div className='flex flex-col w-full'>
                    <Reply createdAt={reply.created_at} userData={userData} commentId={reply.id} postId={postId} supabase={supabase} replyId={reply.id} username={reply?.author_username} authorId={reply?.author_id} reqId={reqId} body={reply?.body} avatarUrl={reply?.avatar_url} />
                  </div>
                </div>
              )
            })}
            <CommentCMS show={isReplyOpen} onSubmitComment={createReply} />
          </>
          )
        : (
          <div className='flex items-center gap-2 text-white font-semibold p-2 text-sm'>
            <button aria-label='Expand post' className='text-white flex gap-2' onClick={() => setIsCommentExpanded(!isCommentExpanded)}>
              <svg className='h-4 stroke-neutral-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#ffffff'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' stroke='inherit' strokeWidth='0.048' /><g id='SVGRepo_iconCarrier'> <path d='M14 10L21 3M21 3H16.5M21 3V7.5M10 14L3 21M3 21H7.5M3 21L3 16.5' stroke='inherit' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /></g></svg>
              <p className='text-neutral-400'>Show hidden comment</p>
            </button>
          </div>
          )}
    </div>
  )
}

export default Comment
