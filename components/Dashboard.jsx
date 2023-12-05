import Link from 'next/link'
import React from 'react'

const Dashboard = ({ session }) => {
  return (
    <div className='bg-neutral-800 flex gap-4 w-full text-white border border-neutral-600 p-2 rounded-md'>
      <Link className='bg-purple-700 font-semibold px-2 py-1 text-sm rounded-full' href='/submit-community'>Create community</Link>
    </div>
  )
}

export default Dashboard
