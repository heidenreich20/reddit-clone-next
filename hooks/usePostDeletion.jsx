// useCommentDeletion.js

import { useState } from 'react'

function usePostDeletion (supabase) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const deletePost = async (postId) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const { error } = await supabase
        .from('posts') // Replace with your table name
        .delete()
        .eq('post_id', postId) // Adjust the key and value based on your table structure
      if (error) {
        setDeleteError(error)
      } else {
        console.log('post deleted')
        // Comment deleted successfully
        // You can implement further actions or state updates here
      }
    } catch (error) {
      setDeleteError(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return { deletePost, isDeleting, deleteError }
}

export default usePostDeletion
