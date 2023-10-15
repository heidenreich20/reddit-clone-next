import React from 'react'

const CommentCMS = ({ newComment, onCommentChange, onSubmitComment }) => {
  return (
    <div className='comment-cms'>
      <textarea
        className='w-full h-24 resize-none rounded-lg p-1'
        placeholder='Write a comment...'
        value={newComment}
        onChange={onCommentChange}
      />
      <button className='comment-submit' onClick={onSubmitComment}>
        Post Comment
      </button>
    </div>
  )
}

export default CommentCMS
