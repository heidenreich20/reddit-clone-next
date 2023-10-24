import React from 'react'
import Link from 'next/link'

const CommunityDashboard = ({ communityToPost }) => {
  return (
    <div className='bg-neutral-800 flex ml-6 w-2/3 gap-4 text-white border border-neutral-600 p-2 rounded-lg'>
      <Link className='bg-purple-500 font-semibold px-2 py-1 text-sm rounded-full' href={`/submit?postTo=${communityToPost}`}>Create post</Link>
      <Link className='outline outline-1 outline-white font-semibold px-2 py-1 text-sm rounded-full' href='/submit-community'>Create post</Link>
    </div>
  )
}

export default CommunityDashboard
