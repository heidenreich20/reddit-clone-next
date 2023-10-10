import React from 'react'

const SkeletonLoader = ({ width, height }) => {
  if (width === 'image' ){
    return (
        <div className='bg-neutral-300/[0.5] w-64 h-64 p-2 rounded-lg text-transparent animate-pulse'>Loading...</div>
    )
  } else {
    return (
        <div className='bg-neutral-300/[0.5] w-64 p-2 rounded-lg text-transparent animate-pulse'>Loading...</div>
    )
  }
}

export default SkeletonLoader