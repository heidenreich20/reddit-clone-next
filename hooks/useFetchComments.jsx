import { useEffect, useState } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

export default function useFetchComments (supabase, params) {
  const [postComments, setPostComments] = useState([])
  const [markdown, setMarkdown] = useState([])

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
        const processedContent = await remark()
          .use(html)
          .process(comments.body)
        const contentHtml = processedContent.toString()
        setMarkdown(contentHtml)
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

  return { postComments, fetchComments, markdown } // Expose the fetchComments function
}
