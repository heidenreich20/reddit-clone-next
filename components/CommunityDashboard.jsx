import React from 'react'
import Link from 'next/link'

const CommunityDashboard = ({ communityToPost }) => {
  return (
    <div className='bg-neutral-800 flex mx-6 gap-4 text-white border border-neutral-600 p-2 rounded-lg'>
      <Link className='bg-purple-700 hover:bg-purple-800 hover:text-neutral-200 transition-colors duration-100 ease-linear font-semibold px-2 py-1 text-sm rounded-full' href={`/submit?postTo=${communityToPost}`}>Create post</Link>
    </div>
  )
}

export default CommunityDashboard
