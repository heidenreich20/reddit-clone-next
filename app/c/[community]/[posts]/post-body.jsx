'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Comment from '@/components/Comment'
import CommentCMS from '@/components/CommentCMS'
import Image from 'next/image'
import useFetchComments from '@/hooks/useFetchComments'
import useCommentDeletion from '@/hooks/useCommentDeletion'
import ConfirmPrompt from '@/components/ConfirmPrompt'

const PostBody = ({ session }) => {
  const [newComment, setNewComment] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const noAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OuTLrRxelnXyGeD6KieoxUZW7gyffxCr3_La8Qm8&s'
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

  const getProfile = useCallback(async () => {
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
      }
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert('Error loading user data!')
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select()
          .eq('post_id', params.posts)
        if (error) {
          console.error('Error fetching posts:', error)
        } else {
          setPost(posts[0])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [supabase])

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

  return (
    <section className='bg-neutral-900'>
      <ConfirmPrompt
        isOpen={isOpen}
        action='Delete'
        onConfirm={handleDelete}
        onClose={closeConfirmPrompt}
        commentId={commentToDelete}
        message='You will permanently delete this comment'
      />
      <div className='flex m-auto md:w-2/3 p-4 gap-6'>
        <div className='gap-12 w-2/3 flex bg-neutral-700 p-2 rounded-lg flex-col'>
          <button onClick={openConfirmPrompt}>Abrir</button>
          <div className='text-white flex gap-3 bg-neutral-600 rounded-lg'>
            <Image alt='post image' className='aspect-video object-cover rounded-l-lg' src={post?.image || noAvatar} width={220} height={60} />
            <p>{post?.body}</p>
          </div>
          <div className=''>
            <CommentCMS
              newComment={newComment}
              onCommentChange={(e) => setNewComment(e.target.value)}
              onSubmitComment={createComment}
            />
            <ul className='flex flex-col gap-2'>
              {postComments?.map((comment) => (
                <Comment
                  reqId={user.id}
                  authorId={comment.author_id}
                  deleteComment={() => openConfirmPrompt(comment.id)}
                  username={comment.comment_owner}
                  key={comment.id}
                  postId={comment.post_id}
                  avatarUrl={comment.avatar_url}
                  body={comment.body}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className='bg-pink-200 w-1/3'>hello world</div>
      </div>
    </section>
  )
}

export default PostBody