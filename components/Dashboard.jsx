import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='bg-neutral-800 col-span-4 col-start-2 text-white border border-neutral-600 p-2 rounded-lg'>
      <Link className='bg-purple-500 font-bold px-2 py-1 text-sm rounded-full' href='/submit'>Create post</Link>
    </div>
  )
}

export default Dashboard
