// useCommentDeletion.js

import { useState } from 'react'

function useCommentDeletion (supabase) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const deleteComment = async (commentId) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const { error } = await supabase
        .from('comments') // Replace with your table name
        .delete()
        .eq('id', commentId) // Adjust the key and value based on your table structure

      if (error) {
        setDeleteError(error)
      } else {
        // Comment deleted successfully
        // You can implement further actions or state updates here
      }
    } catch (error) {
      setDeleteError(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteComment, isDeleting, deleteError }
}

export default useCommentDeletion
