import React from 'react'

const SkeletonLoader = ({ width, height }) => {
  if (width === 'image') {
    return (
      <div className='bg-neutral-300/[0.7] w-fit mx-auto aspect-square h-36 p-2 rounded-full text-transparent animate-pulse'>Loading...</div>
    )
  } else {
    return (
      <div className='bg-neutral-300/[0.7] w-full p-2 rounded-lg text-transparent animate-pulse'>Loading...</div>
    )
  }
}

export default SkeletonLoader
