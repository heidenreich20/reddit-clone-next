'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Comment from '@/components/Comment'

const page = () => {
  const supabase = createClientComponentClient()
  const params = useParams()
  const [post, setPost] = useState(null)
  const [postComments, setPostComments] = useState(null)

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: comments, error } = await supabase
          .from('comments')
          .select()
          .eq('post_id', params.posts)
        if (error) {
          console.error('Error fetching posts:', error)
        } else {
          setPostComments(comments)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchComments()
  }, [supabase])

  return (
    <div>
      <h1>{post?.title}</h1>
      <div>
        {postComments?.map((comment) => (
          <Comment key={comment.id} body={comment.body} avatarUrl={comment.avatar_url} createdAt={comment.created_at} />
        ))}
      </div>
    </div>
  )
}

export default page
