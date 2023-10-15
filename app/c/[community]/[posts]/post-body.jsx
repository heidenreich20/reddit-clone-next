'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Comment from '@/components/Comment'
import CommentCMS from '@/components/CommentCMS'
import Image from 'next/image'
import useFetchComments from '@/hooks/useFetchComments'

const PostBody = ({ session }) => {
  const [newComment, setNewComment] = useState('')
  const noAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5OuTLrRxelnXyGeD6KieoxUZW7gyffxCr3_La8Qm8&s'
  const supabase = createClientComponentClient()
  const params = useParams()
  const [post, setPost] = useState(null)
  const [userData, setUserData] = useState(null)
  const { postComments, fetchComments } = useFetchComments(supabase, params)
  const user = session?.user

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

  const createComment = async () => {
    if (newComment.trim() === '') {
      // Handle empty comment input
      return
    }
    try {
      const { error } = await supabase
        .from('comments')
        .upsert([
          {
            post_id: params.posts,
            body: newComment,
            comment_owner: userData?.username,
            avatar_url: userData?.avatar_url,
            author_id: user?.id
          }
        ])

      if (error) {
        console.error('Error creating comment:', error)
      } else {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  return (
    <section className='bg-neutral-900'>
      <div className='flex m-auto md:w-2/3 p-4 gap-6'>
        <div className='gap-12 w-2/3 flex bg-neutral-700 p-2 rounded-lg flex-col'>
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
