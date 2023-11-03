'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Comment from '@/components/Comment'
import CommentCMS from '@/components/CommentCMS'
import Link from 'next/link'
import useFetchComments from '@/hooks/useFetchComments'
import useCommentDeletion from '@/hooks/useCommentDeletion'
import ConfirmPrompt from '@/components/ConfirmPrompt'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import moment from 'moment'
import ExtraInfo from '@/components/ExtraInfo'

const PostBody = ({ session }) => {
  const [newComment, setNewComment] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const supabase = createClientComponentClient()
  const params = useParams()
  const [post, setPost] = useState(null)
  const [userData, setUserData] = useState(null)
  const { postComments, fetchComments } = useFetchComments(supabase, params)
  const { deleteComment } = useCommentDeletion(supabase)
  const user = session?.user

  const openConfirmPrompt = (commentId) => {
    setIsOpen(true)
    setCommentToDelete(commentId) // Store the commentId in state
  }
  const closeConfirmPrompt = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select()
          .eq('post_id', params.posts)
          .single()
        if (error) {
          console.error('Error fetching posts:', error)
        }
        setPost(posts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [supabase])

  const getProfile = useCallback(async () => {
    if (user) {
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('id, full_name, username, website, avatar_url, created_at')
          .eq('id', user?.id)
          .single()
        if (error && status !== 406) {
          throw error
        }
        if (data) {
          setUserData(data)
          setCreatedAt(data?.created_at)
        }
      } catch (error) {
        // eslint-disable-next-line no-undef
        alert('Error loading user data!')
      }
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  const createComment = async (value) => {
    if (value.trim() === '') {
      // Handle empty comment input
      return
    }
    try {
      const { error } = await supabase
        .from('comments')
        .upsert([
          {
            post_id: params.posts,
            body: value,
            comment_owner: userData?.username,
            avatar_url: userData?.avatar_url,
            author_id: user?.id
          }
        ])

      if (error) {
        console.error('Error creating comment:', error)
      } else {
        fetchComments()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      fetchComments()
      closeConfirmPrompt() // Close the ConfirmPrompt after deletion
    } catch (error) {
      console.log(error)
    }
  }

  const timeSince = moment(createdAt, 'YYYYMMDD').locale('en').fromNow()
  return (
    <section className='bg-neutral-800'>
      <ConfirmPrompt
        isOpen={isOpen}
        action='Delete'
        onConfirm={handleDelete}
        onClose={closeConfirmPrompt}
        itemId={commentToDelete}
        message='You will permanently delete this comment'
      />
      <div className='flex m-auto md:w-2/3 p-4 gap-6'>
        <div className='w-full md:w-2/3 flex bg-neutral-700/[0.4] rounded-lg flex-col'>
          <div className='text-white justify-center flex gap-3 bg-neutral-700/[0.6] rounded-t-lg'>
            <div className='flex w-full flex-col gap-2 p-3 sm:p-5'>
              <div className='flex gap-2'>
                <p className='sm:text-base text-xs'>Posted by</p>
                <Link className='sm:text-base text-xs font-bold text-white' href={`/users/${post?.author_name}`}>{post?.author_name}</Link>
                <p className='sm:text-base text-xs'>{`${timeSince}`}</p>
              </div>
              <h2 className='font-bold text-lg sm:text-xl'>{post?.title}</h2>
              <Markdown className='markdown post-image text-sm w-full overflow-hidden' remarkPlugins={[remarkGfm]}>{post?.body}</Markdown>
              {post?.image ? <img className='w-full' src={post?.image} alt='' /> : null}
            </div>
          </div>
          <div className='flex flex-col justify-center md:p-5'>
            {session
              ? (
                <CommentCMS
                  newComment={newComment}
                  onCommentChange={(e) => setNewComment(e.target.value)}
                  onSubmitComment={createComment}
                />
                )
              : (<Link href='/login' aria-label='You must be logged in to comment' className='text-white font-semibold outline outline-1 m-auto outline-red-600 p-2 rounded-lg w-fit'>You must be logged in to comment</Link>)}
            <ul className='flex gap-6 flex-col rounded-lg p-2'>
              {postComments?.map((comment) => (
                <Comment
                  userData={userData}
                  postId={params?.posts}
                  supabase={supabase}
                  reqId={user?.id}
                  authorId={comment.author_id}
                  deleteComment={() => openConfirmPrompt(comment.id)}
                  username={comment.comment_owner}
                  key={comment.id}
                  commentId={comment.id}
                  avatarUrl={comment.avatar_url}
                  body={comment.body}
                  createdAt={comment.created_at}
                />
              ))}
            </ul>
          </div>
        </div>
        <ExtraInfo session={session} params={params.community} supabase={supabase} />
      </div>
    </section>
  )
}

export default PostBody
