// useCommentDeletion.js

import { useState } from 'react'

function useReplyDeletion (supabase) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const deleteReply = async (commentId) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const { error } = await supabase
        .from('replies') // Replace with your table name
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

  return { deleteReply, isDeleting, deleteError }
}

export default useReplyDeletion
