import { useEffect, useState } from 'react'

export default function useFetchComments (supabase, params) {
  const [postComments, setPostComments] = useState([])

  const fetchComments = async () => {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select()
        .eq('post_id', params.posts)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setPostComments(comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    // Fetch comments when the component mounts or when 'supabase' or 'params' change
    fetchComments()
  }, [supabase])

  return { postComments, fetchComments } // Expose the fetchComments function
}
